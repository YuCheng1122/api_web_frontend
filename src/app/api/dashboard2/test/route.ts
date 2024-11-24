import { NextResponse } from 'next/server';
import axios from 'axios';
import { TimeRange } from '@/features/dashboard2.0/types';
import * as fs from 'fs/promises';
import * as path from 'path';
import { quicktype, InputData, jsonInputForTargetLanguage, JSONSchemaInput, FetchingJSONSchemaStore } from 'quicktype-core';

const BASE_URL = 'https://flask.avocadolab.ai';

const ENDPOINTS = {
    AGENT_SUMMARY: `${BASE_URL}/api/dashboard/agent_summary`,
    TACTICS: `${BASE_URL}/api/dashboard/agent_summary`,
    AGENT_OS: `${BASE_URL}/api/dashboard/agent_os`,
    ALERTS: `${BASE_URL}/api/dashboard/alerts`,
    CVE_BARCHART: `${BASE_URL}/api/dashboard/cve_barchart`,
    TTP_LINECHART: `${BASE_URL}/api/dashboard/tactic_linechart`,
    MALICIOUS_FILE: `${BASE_URL}/api/dashboard/malicious_file_barchart`,
    AUTHENTICATION: `${BASE_URL}/api/dashboard/authentication_piechart`,
    AGENT_NAME: `${BASE_URL}/api/dashboard/agent_name`,
    EVENT_TABLE: `${BASE_URL}/api/dashboard/event_table`,
} as const;

async function fetchWithAuth(url: string, token: string, params?: any) {
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params
    });
    return response.data;
}

async function generateTypeScript(typeName: string, jsonData: any): Promise<string> {
    const jsonInput = jsonInputForTargetLanguage("typescript");
    await jsonInput.addSource({
        name: typeName,
        samples: [JSON.stringify(jsonData)]
    });

    const inputData = new InputData();
    inputData.addInput(jsonInput);

    const result = await quicktype({
        inputData,
        lang: "typescript",
        rendererOptions: {
            "just-types": "true"
        }
    });

    return result.lines.join("\n");
}

export async function GET() {
    const timeRange: TimeRange = {
        start_time: '2024-09-11T00:00:00',
        end_time: '2024-11-12T23:59:59'
    };

    try {
        // Login
        console.log('Attempting login...');
        const formData = new URLSearchParams();
        formData.append('username', 'aaron');
        formData.append('password', 'Wnc168$$');

        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!loginResponse.data.success) {
            throw new Error('Login failed: ' + loginResponse.data.message);
        }

        const token = loginResponse.data.content.access_token;
        const generatedTypes: Record<string, string> = {};

        // Create types directory if it doesn't exist
        const typesDir = path.join(process.cwd(), 'src/features/dashboard2.0/types/generated');
        await fs.mkdir(typesDir, { recursive: true });

        // Fetch data and generate types for each endpoint
        for (const [name, url] of Object.entries(ENDPOINTS)) {
            try {
                console.log(`Fetching data from ${name}...`);
                const data = await fetchWithAuth(url, token, timeRange);
                
                // Generate TypeScript type
                console.log(`Generating type for ${name}...`);
                const typeContent = await generateTypeScript(name, data);
                
                // Save type definition
                const typePath = path.join(typesDir, `${name.toLowerCase()}.ts`);
                await fs.writeFile(typePath, typeContent);
                
                generatedTypes[name] = typePath;
                console.log(`Generated type for ${name}`);
            } catch (error) {
                console.error(`Failed to process ${name}:`, error);
            }
        }

        // Create index.ts to export all types
        const indexContent = Object.entries(generatedTypes)
            .map(([name, path]) => `export * from './${name.toLowerCase()}';`)
            .join('\n');
        
        await fs.writeFile(
            path.join(typesDir, 'index.ts'),
            indexContent
        );

        return NextResponse.json({ 
            success: true, 
            message: 'Types generated successfully',
            generatedTypes: Object.keys(generatedTypes),
            typesDirectory: typesDir
        });
    } catch (error: any) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        });

        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to generate types', 
                details: {
                    message: error.message,
                    response: error.response?.data
                }
            },
            { status: 500 }
        );
    }
}
