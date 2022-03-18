const axios = require('axios');

require('dotenv').config();

module.exports = (req, res) => {
	const {
		code,
		redirect_uri: redirectUri,
		response_type: responseType,
	} = req.body;

	axios
		.request({
			method: 'post',
			url: 'https://github.com/login/oauth/access_token',
			data: {
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET,
				redirectUri,
				responseType,
				code,
			},
			headers: {
				Accept: 'application/json',
			},
		})
		.then((response) => {
			res.status(200).send(response.data);
		})
		.catch((error) => {
			res.status(403).send(error);
		});
};
