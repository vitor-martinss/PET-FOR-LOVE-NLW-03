import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import orphanageView from '../views/orphanages_view'
import Orphanage from '../models/Orphanage'
import * as Yup from 'yup'

export default {
	async index(request: Request, response: Response) {
		const guildRepository = getRepository(Orphanage)

		const guilds = await guildRepository.find({
			relations: ['images']
		})

		return response.json(orphanageView.renderMany(guilds))
	},

	async show(request: Request, response: Response) {
		const { id } = request.params
		const guildRepository = getRepository(Orphanage)

		const guild = await guildRepository.findOneOrFail(id, {
			relations: ['images']
		})

		return response.json(orphanageView.render(guild))
	},

	async create(request: Request, response: Response) {
		const {
			name,
			latitude,
			longitude,
			about,
			instructions,
			opening_hours,
			open_on_weekends,
		} = request.body
	
		const guildRepository = getRepository(Orphanage)

		const requestImages = request.files as Express.Multer.File[]
		
		const images = requestImages.map(image => {
			return {
				path: image.filename
			}
		})

		const data = {
			name,
			latitude,
			longitude,
			about,
			instructions,
			opening_hours,
			open_on_weekends: open_on_weekends === 'true',
			images
		}

		const schema = Yup.object().shape({
			name: Yup.string().required(),
			latitude: Yup.number().required(),
			longitude: Yup.number().required(),
			about: Yup.string().required().max(300),
			instructions: Yup.string().required(),
			opening_hours: Yup.string().required(),
			open_on_weekends: Yup.boolean().required(),
			images: Yup.array(
				Yup.object().shape({
					path: Yup.string().required()
			}))
		})

		await schema.validate(data, {
			abortEarly: false,
		})
	
		const guild = guildRepository.create(data)
	
		await guildRepository.save(guild)
	
		return response.status(201).json(Orphanage)
	}

}