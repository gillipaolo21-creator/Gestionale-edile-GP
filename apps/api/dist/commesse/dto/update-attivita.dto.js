"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAttivitaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_attivita_dto_1 = require("./create-attivita.dto");
class UpdateAttivitaDto extends (0, mapped_types_1.PartialType)(create_attivita_dto_1.AttivitaDto) {
}
exports.UpdateAttivitaDto = UpdateAttivitaDto;
//# sourceMappingURL=update-attivita.dto.js.map