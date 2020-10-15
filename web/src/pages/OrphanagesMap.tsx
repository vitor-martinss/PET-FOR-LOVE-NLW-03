import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiPlus } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

import mapMarkerImg from '../images/icon-map.svg'
import mapIcon from '../utils/mapIcon'
import api from '../services/api'

// typescript interface
interface Guild {
	id: number;
	latitude: number;
	longitude: number;
	name: string;
}

function OrphanagesMap() {

	// this part is responsible for integration with backend
	const [guilds, setGuilds] = useState<Guild[]>([])

	// react hooks since fev2019 -- starting using api - connect to backend
	useEffect(() => {
		api.get('guild').then(response => {
			setGuilds(response.data)
		})
	}, [])

	// this part is basically html
	return (
		<div id="page-map">
			<aside>
				<header>
					<img src={mapMarkerImg} alt="" />
					<h2>Escolha um orfanato no mapa</h2>
					<p>Muitas crianças estão esperando a sua visita</p>
				</header>

				<footer>
					<strong>Lisboa</strong>
					<span>Portugal</span>
				</footer>
			</aside>
			<Map center={[38.7241156, -9.1345474]} zoom={15} style={{ width: '100%', height: '100%' }}>
				{/* <TileLayer url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png' /> */}
				<TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />
				{guilds.map(guild => {
					return (
						<Marker
							icon={mapIcon}
							position={[guild.latitude, guild.longitude]}
							key={guild.id}
						>
							<Popup closeButton={false} minWidth={240} maxWidth={240} className='map-popup'>
								{guild.name}
						<Link to={`/orphanages/${guild.id}`}>
									<FiArrowRight size={20} color="#fff" />
								</Link>
							</Popup>
						</Marker>
					)
				})}
			</Map>

			<Link to="/orphanages/create" className='create'>
				<FiPlus size={32} color="#FFF" />
			</Link>
		</div>
	);
}

export default OrphanagesMap