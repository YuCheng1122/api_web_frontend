export interface NDRAuthResponse {
    token: string;
    refreshToken: string;
    scope: string | null;
}

export interface NDRLoginCredentials {
    username: string;
    password: string;
}

export interface NDRAuthState {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Device Info Types
export interface NDRDeviceInfo {
    cpu_usage: number[];
    memory_usage: number[];
    device_version: string;
    nids_version: string;
    ioc_version: string;
}

// Events Types
export interface NDREvent {
    deviceid: string;
    event: string;
    '@timestamp': string;
    event_type: string;
    src_ip: string;
    src_port: number;
    dest_ip: string;
    dest_port: number;
    proto: string;
    eventname: string;
    domain: string;
    black_list: string;
    severity: number;
    category: string;
    confidence: number;
    signature: string;
    signature_id: number;
    can_block: number;
    can_block_ip: string;
    target: string;
}

export interface NDREventsResponse {
    total: number;
    hits: NDREvent[];
}

// Top Blocking Types
export interface NDRTopBlocking {
    doc_count: number;
    event: string;
    category: string;
    signature: string;
    signature_id: number;
    black_list: string;
    severity: number;
}

// Device Infos Types
export interface NDRDeviceId {
    entityType: string;
    id: string;
}

export interface NDRDeviceListItem {
    id: NDRDeviceId;
    createdTime: number;
    additionalInfo: {
        description: string;
    };
    tenantId: NDRDeviceId;
    customerId: NDRDeviceId;
    name: string;
    type: string;
    label: string;
    deviceProfileId: NDRDeviceId;
    deviceData: {
        configuration: {
            type: string;
        };
        transportConfiguration: {
            type: string;
        };
    };
    firmwareId: null | string;
    softwareId: null | string;
    externalId: null | string;
    customerTitle: string;
    customerIsPublic: boolean;
    deviceProfileName: string;
    active: boolean;
}

export interface NDRDeviceListResponse {
    data: NDRDeviceListItem[];
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
}
