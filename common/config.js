let urlConfig = ''

if (process.env.NODE_ENV === 'development') {
	// urlConfig = 'http://192.168.200.1:80'
	urlConfig = 'https://supery.work'
} else {
	urlConfig = 'https://supery.work'
}

export default urlConfig