import { Resolver } from '@/types';
import { GraphQLError } from 'graphql';

interface CreateLoanInput {
  userEmail: string;
  deviceIds: string[];
  peripheralsIds: string[];
  startDate: Date;
  endDate: Date;
  originCityId: string;
  arrivalCityId: string;
}

interface getLoansByUserEmailInput {
  userEmail: string;
}

interface UpdateLoanStatusInput {
  loanId: string;
  status: 'APPROVED' | 'REJECTED' | 'EXTENDED' | 'PENDING';
  rejectionReason?: string;
}

interface ExtendLoanInput {
  loanId: string;
  newEndDate: Date;
}

export interface CreateTestUserInput {
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT' | 'TECHNICAL' | 'COORDINATOR' | 'EMPLOYEE';
}

export interface CreateTestDeviceInput {
  serialNumber: string;
  brand: string;
  model: string;
  category: 'LAPTOP' | 'PC' | 'MOBILE' | 'TABLET';
  price: number;
  extraInfo?: string;
  components?: CreateTestComponentInput[];
}

export interface CreateTestComponentInput {
  brand: string;
  model: string;
  type: 'RAM' | 'PROCESSOR' | 'GPU' | 'BOARD' | 'STORAGE';
  description: string;
}

export interface CreateTestPeripheralInput {
  serialNumber: string;
  model: string;
  type: 'MOUSE' | 'KEYBOARD' | 'MONITOR' | 'HEADSET' | 'WEBCAM' | 'OTHER';
  brand: string;
  price: number;
  extraInfo?: string;
}

export interface CreateTestCityInput {
  name: string;
}

const loanResolvers: Resolver = {
  Query: {
    getLoans: async (parent, args, { db, authData }) => {
      if (!authData) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      if (authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para ver los préstamos.');
      }
      return await db.loan.findMany({
        include: {
          user: true,
          devices: true,
          peripherals: true,
          originCity: true,
          arrivalCity: true,
        },
      });
    },
    getLoansByUserEmail: async (
      parent,
      { input }: { input: getLoansByUserEmailInput },
      { db, authData }
    ) => {
      if (!authData?.email) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      if (!input?.userEmail) {
        throw new GraphQLError('El correo electrónico del usuario es obligatorio.');
      }
      if (authData.email !== input.userEmail && authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para ver los préstamos de otro usuario.');
      }
      const userId = await db.user
        .findUnique({ where: { email: input.userEmail } })
        .then((u) => (u === null || u.id === null ? '' : u.id))
        .catch(() => '');
      const loans = await db.loan.findMany({
        where: { userId },
        include: {
          user: true,
          devices: {
            include: {
              device: true,
            },
          },
          peripherals: true,
          originCity: true,
          arrivalCity: true,
        },
      });
      const transformedLoans = loans.map(loan => ({
        ...loan,
        devices: loan.devices.map(loanDevice => {
          if (!loanDevice.device) {
            throw new Error('Dispositivo no encontrado en el registro del préstamo.');
          }
          return loanDevice.device;
        })
      }));

      return transformedLoans;
    },
    getLoanReminders: async (parent, args, { db }) => {
      const now = new Date();
      const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      return await db.loan.findMany({
        where: {
          endDate: { gte: now, lte: soon },
          returnDate: null,
        },
      });
    },
  },
  Mutation: {
    createLoan: async (parent, { input }: { input: CreateLoanInput }, { db, authData }) => {
      const activeLoans = await db.loan.count({
        where: {
          userId: await db.user.findUnique({ where: { email: input.userEmail } }).then((u) => (u === null || u.id === null) ? '' : u.id).catch(() => ''),
          returnDate: null,
        },
      });
      if (activeLoans >= 3) {
        throw new GraphQLError('Límite de 3 préstamos activos alcanzado.');
      }

      if (new Date(input.startDate) >= new Date(input.endDate)) {
        throw new GraphQLError('La fecha de inicio debe ser anterior a la fecha de fin.');
      }

      const devices = await db.device.findMany({
        where: {
          id: { in: input.deviceIds },
          loans: {
            some: {
              loan: {
                status: { in: ['PENDING', 'APPROVED', 'EXTENDED'] },
                OR: [
                  { startDate: { lte: new Date(input.startDate) } },
                  { endDate: { gte: new Date(input.endDate) } },
                ],
              },
            },
          },
        },
      });

      if (devices.length) {
        throw new GraphQLError('Uno o más dispositivos seleccionados no están disponibles. Disponibles: ' + devices.map((d) => d.id).join(', '));
      }

      const newLoan = await db.loan.create({
        data: {
          user: { connect: { email: input.userEmail } },
          totalPrice: 0,
          originCity: { connect: { id: input.originCityId } },
          arrivalCity: { connect: { id: input.arrivalCityId } },
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          status: 'PENDING',
          devices: {
            create: input.deviceIds.map((id) => ({
              device: { connect: { id } },
            })),
          },
          peripherals: {
            create: input.peripheralsIds.map((id) => ({
              peripheral: { connect: { id } },
            })),
          },
        },
        include: {
          devices: {
            include: {
              device: true
            }
          },
          peripherals: {
            include: {
              peripheral: true
            }
          },
          originCity: true,
          arrivalCity: true,
        },
      });

      // Transform the response to match the GraphQL schema
      return {
        ...newLoan,
        devices: newLoan.devices.map(loanDevice => loanDevice.device),
        peripherals: newLoan.peripherals.map(loanPeripheral => loanPeripheral.peripheral)
      };
    },
    updateLoanStatus: async (
      parent,
      { input }: { input: UpdateLoanStatusInput },
      { db, authData }
    ) => {
      if (authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para actualizar el estado del préstamo.');
      }
      if (input.status === 'REJECTED' && !input.rejectionReason) {
        throw new GraphQLError('El motivo es obligatorio al rechazar un préstamo.');
      }
      const updatedLoan = await db.loan.update({
        where: { id: input.loanId },
        data: {
          status: input.status,
        },
        include: {
          devices: true,
          originCity: true,
          arrivalCity: true,
          peripherals: true,
        },
      });
      return updatedLoan;
    },
    extendLoan: async (
      parent,
      { input }: { input: ExtendLoanInput },
      { db, authData }
    ) => {
      if (authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para extender el préstamo.');
      }
      const loan = await db.loan.findUnique({ where: { id: input.loanId } });
      if (!loan) {
        throw new GraphQLError('Préstamo no encontrado.');
      }
      if (new Date(input.newEndDate) <= loan.endDate) {
        throw new GraphQLError('La nueva fecha debe ser posterior a la fecha de fin actual.');
      }
      const extendedLoan = await db.loan.update({
        where: { id: input.loanId },
        data: {
          endDate: new Date(input.newEndDate),
          status: 'EXTENDED'
        },
        include: {
          devices: true,
          originCity: true,
          arrivalCity: true,
          peripherals: true,
        },
      });
      return extendedLoan;
    },
    createTestUser: async (parent, { input }: { input: CreateTestUserInput }, { db, authData }) => {
      if (!authData || authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para crear usuarios.');
      }
      return await db.user.create({
        data: {
          name: input.name,
          email: input.email,
          role: {
            connect: {
              name: input.role
            }
          }
        }
      });
    },
    createTestDevice: async (parent, { input }: { input: CreateTestDeviceInput }, { db, authData }) => {
      if (!authData || authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para crear dispositivos.');
      }
      return await db.device.create({
        data: {
          serialNumber: input.serialNumber,
          brand: input.brand,
          model: input.model,
          category: input.category,
          price: input.price,
          extraInfo: input.extraInfo || '',
          components: input.components ? {
            create: input.components.map(component => ({
              component: {
                create: {
                  brand: component.brand,
                  model: component.model,
                  type: component.type,
                  description: component.description
                }
              }
            }))
          } : undefined
        }
      });
    },
    createTestPeripheral: async (parent, { input }: { input: CreateTestPeripheralInput }, { db, authData }) => {
      if (!authData || authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para crear periféricos.');
      }
      return await db.peripheral.create({
        data: {
          serialNumber: input.serialNumber,
          model: input.model,
          type: input.type,
          brand: input.brand,
          price: input.price,
          extraInfo: input.extraInfo || ''
        }
      });
    },
    createTestCity: async (parent, { input }: { input: CreateTestCityInput }, { db, authData }) => {
      if (!authData || authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para crear ciudades.');
      }
      return await db.city.create({
        data: {
          name: input.name
        }
      });
    }
  },
};

export { loanResolvers };