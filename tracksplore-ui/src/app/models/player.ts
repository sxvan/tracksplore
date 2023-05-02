export interface Player {
    connect(): Promise<void>;
    addListener(name: string, callback: Function): Promise<void>;
    togglePlay(): Promise<void>;
    seek(position_ms: number): Promise<void>;
}