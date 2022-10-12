"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDocumentBuilder = void 0;
class GoogleDocumentBuilder {
    constructor(documentId, isCorrect) {
        this.documentId = documentId;
        this.text = '';
        this.isCorrect = isCorrect;
    }
    addTextBlock(text) {
        this.text += text.replace(/\n/g, ' ');
    }
    setIsCorrect(isCorrect) {
        this.isCorrect = isCorrect;
    }
}
exports.GoogleDocumentBuilder = GoogleDocumentBuilder;
//# sourceMappingURL=document-builder.class.js.map