import { PartialType } from '@nestjs/mapped-types'; // Oppure '@nestjs/swagger'
import { AttivitaDto } from './create-attivita.dto';

/**
 * DTO per l'aggiornamento dei "Fogli Figli" (Attività).
 * Estende AttivitaDto rendendo tutti i campi opzionali.
 * Mantiene integri i decoratori di validazione (SOLID).
 */
export class UpdateAttivitaDto extends PartialType(AttivitaDto) {}