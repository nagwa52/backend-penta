import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'reflect-metadata'
import { AppDataSource } from './src/config/database/data-source'
import logger from './src/config/logger'
import configurations from './src/config/configurations'
import userRouter from './src/routes/user.routes'
import countryRouter from './src/routes/countries.routes';

import appRoutes from "./src/routes/app.routes";

import searchRouter from './src/routes/search.routes';
import {createServer} from "http";
import { Server } from "socket.io";
import createDirectories from "./src/helpers/functions/createDirectories";
import {mkdirSync} from "fs";
const app = express()
const server = createServer(app);
export const io = new Server(server, {
	cors: {origin: true}
});

app.use(cors({ origin: true, credentials: true }))
// create a rotating write stream
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))

// io.on("connection", function(socket: any) {
// 	console.log("a user connected");
// 	console.log(socket.id);
//   });


AppDataSource.initialize()
	.then((connection) => {
		const config = configurations()
		// app.use('/', indexRouter);
		createDirectories();
		app.use('/auth', authRouter)
		app.use('/api/companies', companyRoutes)
		app.use('/api/hotels', hotelsRoutes)
		app.use('/api/admin', adminRoutes)
		app.use('/api/users', userRouter)
		app.use('/api/travelers', travelerRouter)
		app.use('/api/countries', countryRouter)
		app.use('/', appRoutes)
		app.use('/api/cycles', cycleRoutes)
		app.use('/api/programs', programsRoutes)
		app.use('/api/groups', groupRoutes)
		app.use('/api/friendrequests', friendRequestRoutes)
		app.use('/api/hotel_reviews', hotelReviewsRoutes)
		app.use('/api/country_reviews', countryReviewsRoutes)
		app.use('/api/cycle_reviews', cycleReviewsRoutes)
		app.use('/api/guide_reviews', guideReviewsRoutes)
		app.use('/api/company_reviews', companyReviewsRoutes)
		app.use('/api/search', searchRouter)
		app.use('/api/posts', postRoutes)
		app.use('/api/posts_reports', postReportsRoutes)
		server.listen(config.port, () => {
			console.log(`Server running on PORT: ${config.port}`)
		})
	})
	.catch((error) => {
		logger.log(
			'error',
			'Error connecting to database: ' + JSON.stringify(error)
		)
	})
