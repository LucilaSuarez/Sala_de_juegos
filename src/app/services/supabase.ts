import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable({providedIn: "root"})

export class SupabaseService {
    private client: SupabaseClient;   
    constructor() {
        const supabaseUrl = "https://qlyajlyycturztfjasrq.supabase.co";
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFseWFqbHl5Y3R1cnp0Zmphc3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNjExNzcsImV4cCI6MjA5MzkzNzE3N30.Nsx1Q_VW3C18oGRq-yFaLy_BEKtVsrP3CIG5-ZPHsZ0";
        this.client = createClient(supabaseUrl, supabaseKey);
    }    
    getClient(): SupabaseClient {
        return this.client;
    }  
}