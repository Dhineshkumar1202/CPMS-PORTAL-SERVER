import path from 'path';
import DataUriParser from 'datauri/parser.js';

const getDataUri = (file) => {
    try {
        if (!file || !file.originalname || !file.buffer) {
            throw new Error('Invalid file object');
        }

        const parser = new DataUriParser();
        const extName = path.extname(file.originalname).toString();
        return parser.format(extName, file.buffer);
    } catch (error) {
        console.error('Error creating data URI:', error);
        throw error;  
    }
}

export default getDataUri;
