import path from 'path';
import DataUriParser from 'datauri/parser.js';

const getDataUri = (file) => {
    try {
        if (!file || !file.originalname || !file.buffer) {
            console.error('Invalid file object:', file);
            return null;
        }

        const parser = new DataUriParser();
        const extName = path.extname(file.originalname).slice(1); // Remove the dot (`.`)
        return parser.format(extName, file.buffer);
    } catch (error) {
        console.error('Error creating data URI:', error);
        return null;
    }
}

export default getDataUri;
