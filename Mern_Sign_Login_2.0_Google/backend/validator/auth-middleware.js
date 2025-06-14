const Validate = (schema) => async (req, res, next) => {
    try {
        const parsedBody = await schema.parseAsync(req.body); // Fixed `parseAsyn` typo
        req.body = parsedBody;
        next();
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.errors }); // Send validation errors as response
    }
};

module.exports = Validate;
