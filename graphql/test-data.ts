import { CreateTestUserInput, CreateTestDeviceInput, CreateTestPeripheralInput, CreateTestCityInput } from './entities/loan/resolvers';

export const testUsers: CreateTestUserInput[] = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN'
  },
  {
    name: 'Client User',
    email: 'client@example.com',
    role: 'CLIENT'
  },
  {
    name: 'Technical User',
    email: 'technical@example.com',
    role: 'TECHNICAL'
  },
  {
    name: 'Coordinator User',
    email: 'coordinator@example.com',
    role: 'COORDINATOR'
  },
  {
    name: 'Employee User',
    email: 'employee@example.com',
    role: 'EMPLOYEE'
  }
];

export const testDevices: CreateTestDeviceInput[] = [
  {
    serialNumber: 'LAP001',
    brand: 'Dell',
    model: 'XPS 13',
    category: 'LAPTOP',
    price: 1200,
    extraInfo: 'High-end laptop for professionals',
    components: [
      {
        brand: 'Intel',
        model: 'i7-1165G7',
        type: 'PROCESSOR',
        description: '11th Gen Intel Core i7'
      },
      {
        brand: 'Samsung',
        model: '16GB DDR4',
        type: 'RAM',
        description: '16GB DDR4 RAM'
      }
    ]
  },
  {
    serialNumber: 'PC001',
    brand: 'HP',
    model: 'EliteDesk 800',
    category: 'PC',
    price: 1500,
    extraInfo: 'Workstation PC',
    components: [
      {
        brand: 'AMD',
        model: 'Ryzen 7 5800X',
        type: 'PROCESSOR',
        description: 'AMD Ryzen 7 5800X'
      },
      {
        brand: 'Corsair',
        model: '32GB DDR4',
        type: 'RAM',
        description: '32GB DDR4 RAM'
      }
    ]
  },
  {
    serialNumber: 'MOB001',
    brand: 'Samsung',
    model: 'Galaxy S21',
    category: 'MOBILE',
    price: 800,
    extraInfo: 'Flagship smartphone'
  },
  {
    serialNumber: 'TAB001',
    brand: 'Apple',
    model: 'iPad Pro',
    category: 'TABLET',
    price: 1000,
    extraInfo: 'Professional tablet'
  }
];

export const testPeripherals: CreateTestPeripheralInput[] = [
  {
    serialNumber: 'MOU001',
    model: 'MX Master 3',
    type: 'MOUSE',
    brand: 'Logitech',
    price: 100,
    extraInfo: 'Wireless mouse'
  },
  {
    serialNumber: 'KEY001',
    model: 'MX Keys',
    type: 'KEYBOARD',
    brand: 'Logitech',
    price: 120,
    extraInfo: 'Wireless keyboard'
  },
  {
    serialNumber: 'MON001',
    model: 'P2418D',
    type: 'MONITOR',
    brand: 'Dell',
    price: 300,
    extraInfo: '24-inch monitor'
  },
  {
    serialNumber: 'HEA001',
    model: 'WH-1000XM4',
    type: 'HEADSET',
    brand: 'Sony',
    price: 350,
    extraInfo: 'Noise-cancelling headphones'
  }
];

export const testCities: CreateTestCityInput[] = [
  {
    name: 'Madrid'
  },
  {
    name: 'Barcelona'
  },
  {
    name: 'Valencia'
  },
  {
    name: 'Sevilla'
  }
]; 