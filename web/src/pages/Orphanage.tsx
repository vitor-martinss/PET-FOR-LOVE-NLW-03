import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams } from 'react-router-dom'

import Sidebar from "../components/Sidebar";
import api from "../services/api";
import mapIcon from "../utils/mapIcon";

// typescript interface
interface Guild {
	latitude: number;
	longitude: number;
	name: string;
	about: string;
	instructions: string;
	opening_hours: string;
	open_on_weekends: string;
	images: Array<{
		id: number;
		url: string;
	}>
}

interface GuildParams {
	id: string
}

export default function Orphanage() {

	// use this for get the id on url
	const params = useParams<GuildParams>()


	// this part is responsible for integration with backend
	const [guild, setGuild] = useState<Guild>()

	// state for check with image is selected
	const [activeImageIndex, setActiveImageIndex] = useState(0)

	// react hooks since fev2019 -- starting using api - connect to backend
	// if you have te use ${params.id} inside the useEffect, you must put it in the second parameter as well
	useEffect(() => {
		api.get(`guild/${params.id}`).then(response => {
			setGuild(response.data)
		})
	}, [params.id])


	// shimmer effect - you can change for a preloader os something else
	if (!guild) {
		return <p>Carregando</p>
	}

	return (
		<div id="page-orphanage">
			<Sidebar />

			<main>
				<div className="orphanage-details">
					<img src={guild.images[activeImageIndex].url} alt={guild.name} />

					<div className="images">
						{guild.images.map((image, index) => {
							return (
								<button 
									key={image.id}
									className={activeImageIndex === index ? 'active' : ''}
									type="button"
									onClick={()=>{setActiveImageIndex(index)}}
								>
									<img src={image.url} alt={guild.name} />
								</button>
							)
						})}
					</div>

					<div className="orphanage-details-content">
						<h1>{guild.name}</h1>
						<p>{guild.about}</p>

						<div className="map-container">
							<Map
								center={[guild.latitude, guild.longitude]}
								zoom={16}
								style={{ width: '100%', height: 280 }}
								dragging={false}
								touchZoom={false}
								zoomControl={false}
								scrollWheelZoom={false}
								doubleClickZoom={false}
							>
								<TileLayer
									url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
								/>
								<Marker interactive={false} icon={mapIcon} position={[-27.2092052, -49.6401092]} />
							</Map>

							<footer>
								<a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${guild.latitude}, ${guild.longitude}`}>Ver rotas no Google Maps</a>
							</footer>
						</div>

						<hr />

						<h2>Instruções para visita</h2>
						<p>{guild.instructions}</p>

						<div className="open-details">
							<div className="hour">
								<FiClock size={32} color="#15B6D6" />
								Segunda à Sexta <br />
								{guild.opening_hours}
							</div>
							{guild.open_on_weekends ? (
								<div className="open-on-weekends">
									<FiInfo size={32} color="#39CC83" />
										Atendemos <br />
										fim de semana
								</div>
							) : (
									<div className="open-on-weekends dont-open">
										<FiInfo size={32} color="#FF669D" />
										Não Atendemos <br />
										fim de semana
									</div>
								)}


						</div>

						<button type="button" className="contact-button">
							<FaWhatsapp size={20} color="#FFF" />
							Entrar em contato
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}