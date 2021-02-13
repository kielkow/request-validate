module.exports = async (obj, fields) => {
    try {
        for (field of fields) {
            let exists = false;

            const validateExists = (async obj => {
                for (const prop in obj) {
                    if (typeof obj[prop] === 'object' || Array.isArray(obj[prop])) {
                        await validateExists(obj[prop]);
                    }

                    if (prop === field) {
                        exists = true;
                        return;
                    };
                }
            });
            await validateExists(obj);
            if (!exists) {
                throw `${field} must be informed!`
            }

            const validateNullable = (async obj => {
                for (const prop in obj) {
                    if (Array.isArray(obj[prop]) || typeof obj[prop] === 'object') {
                        await validateNullable(obj[prop]);
                    }
                    
                    if (fields.includes(prop)) {
                        if (obj[prop] === null || obj[prop] === '' || obj[prop] === undefined) {
                            throw `${prop} must be informed!`
                        };
                    }
                }
            });
            await validateNullable(obj);
        }
    }
    catch (err) {
        throw err;
    }
};
