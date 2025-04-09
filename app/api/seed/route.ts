import { NextResponse } from 'next/server';

export async function POST() {

    try {
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error durante el seeding' },
            { status: 500 }
        );
    }
}