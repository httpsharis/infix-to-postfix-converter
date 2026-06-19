import { execFile } from 'child_process';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request) {
    try {
        const { expression } = await req.json();

        if (!expression) {
            return NextResponse.json(
                { status: 'error', message: 'No expression provided' }, 
                { status: 400 }
            );
        }

        // process.cwd() is the 'frontend' directory. We step out to hit the 'engine' folder.
        const enginePath = path.resolve(process.cwd(), '../engine/engine_cli');

        return new Promise((resolve) => {
            execFile(enginePath, [expression], (error, stdout, stderr) => {
                if (error) {
                    console.error("C++ Engine Error:", stderr || error.message);
                    return resolve(NextResponse.json(
                        { status: 'error', message: 'Mathematical or syntactical error within engine.' },
                        { status: 400 }
                    ));
                }

                try {
                    const parsedData = JSON.parse(stdout);
                    resolve(NextResponse.json(parsedData, { status: 200 }));
                } catch (parseError) {
                    console.error("JSON Parse Error:", stdout);
                    resolve(NextResponse.json(
                        { status: 'error', message: 'Engine returned invalid data format.' },
                        { status: 500 }
                    ));
                }
            });
        });

    } catch (error) {
        return NextResponse.json(
            { status: 'error', message: 'Internal server error.' }, 
            { status: 500 }
        );
    }
}