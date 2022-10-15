import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../../asset/logo.jpg"
import "./Navbar.css"

export const Navbar = () => {
	return (
		<div className="navContainer">
			<div className="left">
				<div className="logo">
					<img src={logo} alt="." />
				</div>
				<div className="name">
				<Link className='text-link'  to="/">Scheduler</Link>

				</div>
			</div>
		</div>
	)
}
