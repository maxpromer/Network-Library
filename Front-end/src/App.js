import React, { Component } from 'react';
import { Route, Switch, Link, NavLink } from 'react-router-dom'
import openSocket from 'socket.io-client';
import './app.css'

const SOCKET_IO_PORT = 8000;
const socket = openSocket('http://localhost:' + SOCKET_IO_PORT);

const isLogin = () => {
	if (localStorage.getItem("login_token") === null) {
		localStorage.setItem("login_token", "")
	}
	return localStorage.getItem("login_token") !== "";
}

const Header = (props) => {
	return (
		<header>
			<div className="headerName">
				<h1>Network</h1>
				<h1>Library</h1>
			</div>
			{
				!isLogin() ? (
				<div className="headerButton">
					<Link to="/login">เข้าสู่ระบบ</Link>
					<Link to="/register">สมัครสมาชิก</Link>
				</div>
				) : (
					<div className="headerButton">
						<Link to="/profile">ข้อมูลส่วนตัว</Link>
						<Link to="/" onClick={(e) => { localStorage.setItem("login_token", ""); window.location.reload(); }}>ออกจากระบบ</Link>
					</div>
				)
			}
		</header>
	)
}

const Navigation = (props) => {
	return (
		<div className="navigation">
			<nav>
				<NavLink exact to="/" activeClassName="active">หน้าแรก</NavLink>
				<NavLink to="/category" activeClassName="active">คลังหนังสือ</NavLink>
				<NavLink to="/popular" activeClassName="active">ยอดนิยม</NavLink>
				<NavLink to="/point" activeClassName="active">เติมพอยท์</NavLink>
			</nav>
			<input placeholder="ค้นหา" />
		</div>
	)
}

class CategoryList extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			listComponent: []
		}

		socket.on("rosListCategory", function(data) {
			console.log(data);

			let listComp = [];
			data.forEach(function(element) {
				let CategoryId = element.CategoryId;
				let name = element.name;
				listComp.push(
					<NavLink to={ "/category/" + CategoryId + "/" + name } onClick={ (e) => { e.preventDefault(); window.location = "/category/" + CategoryId + "/" + name; return false; } } activeClassName="active">{name}</NavLink>
				);
			});
			this.setState({
				listComponent: listComp
			});
			this.forceUpdate()
		}.bind(this));

		socket.emit('listCategory', { });
	}

	render() {
		return (
			<div className="category-list">
				<nav>
					{this.state.listComponent}
				</nav>
			</div>
		)
	}
}

const Footer = (props) => {
	return (
		<footer>
		</footer>
	)
}

class ListBookBox extends React.Component {
	constructor(props) {
		super(props);

		console.log("re render", this.props.CategoryName);
		
		this.state = {
			bookHTML: ""
		};

		this.orderToName = {
			"popular": "ยอดนิยม",
			"new": "ใหม่",
			"category": "หมวด" + this.props.CategoryName,
			"max-borrow": "ถูกยืมมากที่สุด"
		};

		console.log(this.props.CategoryName);

		this.boxId = Math.random().toString(36).substring(2, 7);

		socket.on("rosListBook-" + this.boxId, function(data) {
			console.log(data);

			let html = [];
			data.forEach(element => {
				let BookId = element.BookId;
				let name = element.name;
				let credit = element.credit;
				let image = element.image;
				html.push(
					<li>
						<NavLink to={"/book/" + BookId + "/" + name}>
							<div className="bookPic">
								<img src={image} />
							</div>
							<div className="bookName">{name}</div>
							{props.orderBy === "popular" ? 
							<i className="rating-star" style={{width: element.totalPoint * 20 + "px"}}></i>
							:
							<div className="bookCoin">{credit}</div>
							}
						</NavLink>
					</li>
				);
			});

			this.setState({ bookHTML: html });
		}.bind(this));

		let sendData = { 
			orderBy: props.orderBy, 
			limit: parseInt(props.limit),
			rosCode: this.boxId
		};
		if (this.props.orderBy === "category") {
			sendData.CategoryName = this.props.CategoryName;
		}
		socket.emit('listBook', sendData);
	}

	shouldComponentUpdate(nextProps, nextState){
		return true
	}

	render() {
		return (
			<div className="boxBook">
				{ this.props.orderBy !== "all" && this.props.title !== "false" ? 
					(<div className="boxTitle">
						<div className="title">{this.orderToName[this.props.orderBy]}</div>
						<div className="more">
							{ this.props.more !== "false" ? <Link to={"/" + this.props.orderBy}>ดูเพิ่มเติม</Link> : <div></div> }
						</div>
					</div>)
				: (<div></div>)}
				<ul data-boxid={this.boxId}>{this.state.bookHTML}</ul>
			</div>
		);
	}
}

const homePage = (props) => {
	return (
		<div className="homePage">
			<Header />
			<Navigation />
			<ListBookBox orderBy="popular" limit="5" />
			<ListBookBox orderBy="max-borrow" limit="5" />
			<ListBookBox orderBy="new" limit="5" />
			<Footer />
		</div>
	)
}

class bookPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			BookId: 0,
			name: "",
			image: "",
			credit: 0,
			totalPoint: 0,
			MemId: 0,
			username: "",
			CategoryId: 0,
			CategoryName: "",
			description: "",
			createdOn: "",
			Status: null,
			listReview: []
		}

		socket.on("rosBookDetail", function(data) {
			console.log(data);

			this.setState(data);

			socket.on("rosListReview", function(data) {
				console.log(data);
	
				let html = [];
				data.forEach(element => {
					let point = element.point;
					let comment = element.comment;
					let user = element.user;
					let createdOn = element.createdOn;
					html.push(
						<li>
							<p className="rating"><i className="rating-star" style={{width: point * 20 + "px"}}></i></p>
							<p className="comment">{comment}</p>
							<p className="by">โดย {user} เมื่อ {new Date(createdOn).toLocaleString("th")}</p>
						</li>
					);
				});
	
				this.setState({ listReview: html.length > 0 ? html : <i>ยังไม่มีความเห็นในขณะนี้</i> });
				socket.off("rosListReview");
			}.bind(this));

			socket.emit('listReview', {
				BookId: this.props.match.params.id
			});
		}.bind(this));

		socket.emit('bookDetail', {
			BookId: this.props.match.params.id,
			token: localStorage.getItem("login_token")
		});
	}

	render() {
		return (
			<div className="homePage">
				<Header />
				<Navigation />
				<div className="box-book-detail">
					<h1>{this.state.name}</h1>
					<div className="box">
						<div className="box-image">
							<img src={this.state.image} />
						</div>
						<div className="right">
							<ul>
								<li>
									<span>หมวดหมู่</span>
									<Link to={"/category/" + this.state.CategoryId + "/" + this.state.CategoryName}>{this.state.CategoryName}</Link>
								</li>
								{this.state.totalPoint ? 
								<li>
									<span>คะแนน</span>
									<i className="rating-star" style={{width: this.state.totalPoint * 20 + "px"}}></i>
								</li>
								: ""}
								<li>
									<span>ลงโดย</span>
									{this.state.username}
								</li>
								<li>
									<span>สถานะ</span>
									{!this.state.Status || this.state.Status === "Return" ? "ยืมได้" : "ยืมไม่ได้"}
								</li>
								<li>
									<span>ราคายืม</span>
									{this.state.credit} เหรียญ
								</li>
								{this.state.LoginMemId === this.state.MemId ?
									<li>
										<Link to={"/book/" + this.state.BookId + "/" + this.state.name + "/edit"}>แก้ไขโพสนี้</Link>
									</li>
								: ""}
							</ul>
						</div>
					</div>
					<h2>รายละเอียด</h2>
					<div className="description" dangerouslySetInnerHTML={{__html: this.state.description.replace(/(?:\r\n|\r|\n)/g, '<br>')}} />
					<div className="boxButton">
						{(!this.state.Status || this.state.Status === "Return") && isLogin() && this.state.LoginMemId !== this.state.MemId ? <NavLink className="btn" to={"/book/" + this.state.BookId + "/" + this.state.name + "/borrow"}>ยืมหนังสือเล่มนี้</NavLink> : ""}
					</div>
					<div className="box-list-review">
						<h1>ความเห็นของเพื่อน ๆ</h1>
						<ul>{this.state.listReview}</ul>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

class borrowPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			BookId: 0,
			name: "",
			image: "",
			credit: 0,
			debit: 0,
			Status: null,
			listAddress: [],
			sendName: "",
			sendAddress: "",
			sendPostcode: "",
			sendTel: "",
			selectAddressId: 0,
			dateBorrow: "",
			dateReturn: ""
		}

		socket.on("rosBookDetail", function(data) {
			console.log(data);

			this.setState(data);
			socket.off("rosBookDetail");
		}.bind(this));

		socket.emit('bookDetail', {
			BookId: this.props.match.params.id
		});

		socket.on("rosListAddress", function(data) {
			console.log(data);

			let list = [];
			data.forEach(function(element) {
				let selectAddress = function(e) {
					this.setState({
						sendName: element.name,
						sendAddress: element.address,
						sendPostcode: element.postcode,
						sendTel: element.tel,
						selectAddressId: element.AddressId
					});

					let AddressId = element.AddressId;

					document.querySelectorAll("#listAddress_ul > li").forEach(function(li) {
						li.getAttribute("data-id") == AddressId ? li.classList.add("active") : li.classList.remove("active")
					}.bind(this));
				}.bind(this);

				list.push(
					<li onClick={selectAddress} data-id={element.AddressId} key={element.AddressId}>
						<div className="name">ชื่อ: {element.name}</div>
						<div className="address">ที่อยู่: {element.address}</div>
						<div className="postcode">รหัสไปรษณีย์ {element.postcode}</div>
						<div className="tel">โทร. {element.tel}</div>
					</li>
				);
			}.bind(this));

			this.setState({
				listAddress: list
			});

			socket.off("rosListAddress");
		}.bind(this));

		socket.emit('listAddress', {
			token: localStorage.getItem("login_token")
		});

		socket.on("rosCheckLogin", function(data) {
			console.log(data);

			this.setState({
				debit: data.debit
			});
			socket.off("rosCheckLogin");
		}.bind(this));

		socket.emit('checkLogin', {
			token: localStorage.getItem("login_token")
		});

		this.saveBorrow = function(e) {

			if (this.state.selectAddressId === 0) {
				alert("กรุณาเลือกที่อยู่");
				return;
			}
			
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();
			let now = Date.parse(yyyy + "-" + mm + "-" + dd);
			let dateBorrowMS = Date.parse(this.state.dateBorrow);
			let dateReturnMS = Date.parse(this.state.dateReturn);

			if (this.state.dateBorrow.length === 0 || !this.state.dateReturn.length === 0) {
				alert("กรุณาเลือกวันยืม - คืน");
				return;
			}

			if (dateBorrowMS <= now || dateReturnMS < now) {
				alert("วันที่ยืม-คืน ต้องไม่ใช่วันนี้ หรือก่อนหน้านี้");
				return;
			}

			if (dateBorrowMS >= dateReturnMS) {
				alert("ต้องเลือกวันคืนหลังวันยืมอย่างน้อย 1 วัน");
				return;
			}

			socket.on("rosAddBorrow", function(data) {
				console.log(data);

				alert("เพิ่มหนังสือนี้ลงในรายการยืมของคุณแล้ว");
				window.location = "/borrow";
			}.bind(this));

			socket.emit('addBorrow', {
				token: localStorage.getItem("login_token"),
				BookId: this.state.BookId,
				send: {
					name: this.state.sendName,
					address: this.state.sendAddress,
					postcode: this.state.sendPostcode,
					tel: this.state.sendTel
				},
				dateBorrow: this.state.dateBorrow,
				dateReturn: this.state.dateReturn
			});
		}.bind(this);
	}

	render() {
		return (
			<div className="homePage">
				<Header />
				<Navigation />
				<div className="box-borrow">
					<h1>ยืนยันการยืม</h1>
					<h2>{this.state.name}</h2>
					<div className="box">
						<div className="box-image">
							<img src={this.state.image} />
						</div>
						<div className="right">
							<ul>
								<li>
									<span>เหรียญที่ใช้</span>
									{this.state.credit}
								</li>
								<li>
									<span>เหรียญที่เหลือ</span>
									{this.state.debit}
								</li>
								<li>
									<span>วันที่ยืม</span>
									<input type="date" className="input-sty" onChange={(e) => this.setState({ dateBorrow: e.target.value }) } value={this.state.dateBorrow} />
								</li>
								<li>
									<span>วันที่คืน</span>
									<input type="date" className="input-sty" onChange={(e) => this.setState({ dateReturn: e.target.value }) } value={this.state.dateReturn} />
								</li>
							</ul>
						</div>
					</div>
					<div className="boxListAddress">
						<h1>เลือกที่อยู่จัดส่ง</h1>
						<ul id="listAddress_ul">{this.state.listAddress}</ul>
					</div>
					<div className="boxButton">
						{(!this.state.Status || this.state.Status === "Return") && this.state.credit <= this.state.debit  ? <button className="btn" onClick={this.saveBorrow}>ยืนยัน</button> : ""}
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

class reviewPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			image: "",
			point: 0,
			comment: ""
		}

		this.saveReview = function(e) {
			if (this.state.point === 0) {
				alert("กรุณาให้คะแนนความพึงพอใจอย่างน้อย 1 คะแนน");
				return;
			}


			socket.on("rosAddReview", function(data) {
				console.log(data);

				alert("บันทึกความเห็นของคุณแล้ว");
				window.location = "/borrow";
			});

			socket.emit('addReview', {
				token: localStorage.getItem("login_token"),
				BookId: this.props.match.params.id,
				point: this.state.point,
				comment: this.state.comment
			});
		}.bind(this);

		socket.on("rosBookDetail", function(data) {
			console.log(data);

			this.setState({
				name: data.name,
				image: data.image
			});
			socket.off("rosBookDetail");
		}.bind(this));

		socket.emit('bookDetail', {
			BookId: this.props.match.params.id
		});
	}

	render() {
		return (
			<div className="homePage">
				<Header />
				<Navigation />
				<div className="box-review">
					<h1>รีวิวหนังสือ</h1>
					<h2>{this.state.name}</h2>
					<div className="boxRow">
						<div className="box-image">
							<img src={this.state.image} />
						</div>
						<div className="box-detail">
							<div>
								<label>ระดับความพึงพอใจ</label>
								<ul className="rating-star-input">
									<li><img onClick={(e) => this.setState({ point: 1 })} src={this.state.point >= 1 ? "/rating-star-64x64.png" : "/rating-star-blank-64x64.png"} /></li>
									<li><img onClick={(e) => this.setState({ point: 2 })} src={this.state.point >= 2 ? "/rating-star-64x64.png" : "/rating-star-blank-64x64.png"} /></li>
									<li><img onClick={(e) => this.setState({ point: 3 })} src={this.state.point >= 3 ? "/rating-star-64x64.png" : "/rating-star-blank-64x64.png"} /></li>
									<li><img onClick={(e) => this.setState({ point: 4 })} src={this.state.point >= 4 ? "/rating-star-64x64.png" : "/rating-star-blank-64x64.png"} /></li>
									<li><img onClick={(e) => this.setState({ point: 5 })} src={this.state.point >= 5 ? "/rating-star-64x64.png" : "/rating-star-blank-64x64.png"} /></li>
								</ul>
							</div>
							<div>
								<label>Comment</label>
								<textarea className="input-sty" onChange={(e) => this.setState({ comment: e.target.value })}></textarea>
							</div>
						</div>
					</div>
					<div className="box-button">
						<button className="btn" onClick={this.saveReview}>ส่ง</button>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

class categoryPage extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div className="homePage">
				<Header />
				<Navigation />
				<CategoryList />
				<ListBookBox orderBy={typeof this.props.match.params.name !== "undefined" ? "category" : "all"} CategoryName={this.props.match.params.name} more="false" title="false" limit="100000" /> 
				<Footer />
			</div>
		)
	}
}

const popularPage = (props) => {
	return (
		<div className="homePage">
			<Header />
			<Navigation />
			<ListBookBox orderBy="popular" limit="100000" more="false" />
			<Footer />
		</div>
	)
}

const newPage = (props) => {
	return (
		<div className="homePage">
			<Header />
			<Navigation />
			<ListBookBox orderBy="new" limit="100000" more="false" />
			<Footer />
		</div>
	)
}

const maxBorrowPage = (props) => {
	return (
		<div className="homePage">
			<Header />
			<Navigation />
			<ListBookBox orderBy="max-borrow" limit="100000" more="false" />
			<Footer />
		</div>
	)
}

const pointPage = (props) => {
	return (
		<div className="homePage">
			<Header />
			<Navigation />
			<div style={{textAlign: "center", padding: "20px 10px"}}>
				<img src="/payment.png" />
			</div>
			<Footer />
		</div>
	)
}

const MyProfileMenu = (props) => {
	return (
		<div className="subMenu">
			<nav>
				<NavLink to="/profile" activeClassName="active">ข้อมูลส่วนตัว</NavLink>
				<NavLink to="/address" activeClassName="active">รายการที่อยู่</NavLink>
				<NavLink to="/my-book" activeClassName="active">หนังสือของฉัน</NavLink>
				<NavLink to="/borrow" activeClassName="active">รายการยืม</NavLink>
			</nav>
		</div>
	)
}

class profilePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: "",
			email: "",
			password: "",
			re_password: "",
			coin: 0,
			join: ""
		}

		socket.on("rosCheckLogin", function(data) {
			console.log(data);

			this.setState({
				user: data.user,
				email: data.email,
				coin: data.debit,
				join: data.createdOn
			});
		}.bind(this));

		socket.emit('checkLogin', {
			token: localStorage.getItem("login_token")
		});

		this.saveProfile = function(e) {
			e.preventDefault();
	
			let sendData = {
				token: localStorage.getItem("login_token"),
				user: this.state.user
			}
	
			if (this.state.password.length > 0) {
				if (this.state.password !== this.state.re_password) {
					alert("รหัสผ่านไม่ถูกต้อง, Password และ Re-Password ต้องตรงกัน");
					return;
				} else {
					sendData.password = this.state.password;
				}
			}

			socket.on("rosUpdateProfile", function(data) {
				console.log(data);
	
				socket.off("rosUpdateProfile");
				alert("บันทึกสำเร็จ !, กรณีเปลี่ยนรหัสผ่านจะมีผลในครั้งแต่ไปที่คุณเข้าสู่ระบบทันที");
			});

			socket.emit('updateProfile', sendData);
		}.bind(this);
	}

	render() {
		return (
			<div className="homePage">
				<Header />
				<Navigation />
				<MyProfileMenu />
				<form className="profile-edit-form" onSubmit={this.saveProfile}>
					<legend>ข้อมูลส่วนตัว</legend>
					<div>
						<label>Username</label>
						<input type="text" onChange={(e) => this.setState({ user: e.target.value }) } value={this.state.user} />
					</div>
					<div>
						<label>E-mail</label>
						<input type="text" value={this.state.email} readOnly />
					</div>
					<div>
						<label>Password</label>
						<input type="password" onChange={(e) => this.setState({ password: e.target.value }) } value={this.state.password} />
					</div>
					<div>
						<label>Re-Password</label>
						<input type="password" onChange={(e) => this.setState({ re_password: e.target.value }) } value={this.state.re_password} />
					</div>
					<div>
						<label>เหรียญที่เหลือ</label>
						<input type="text" value={this.state.coin} readOnly />
					</div>
					<div>
						<label>เข้าร่วมเมื่อ</label>
						<input type="text" value={new Date(this.state.join).toLocaleString('TH')} readOnly />
					</div>
					<div className="boxButton">
						<button type="submit">บันทึก</button>
					</div>
				</form>
				<Footer />
			</div>
		)
	}
}

class myBookPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			listMyBook: [],
			showDialog: false,
			sendName: "",
			sendAddress: "",
			sendPostcode: "",
			sendTel: ""
		}

		socket.on("rosListMyBook", function(data) {
			console.log(data);

			let changeToBorrow = function(BookId) {
				socket.on("rosChangeBorrowStatus", function(data) {
					console.log(data);

					// this.forceUpdate();
					socket.emit('listMyBook', {
						token: localStorage.getItem("login_token")
					});
					socket.off("rosChangeBorrowStatus");
				}.bind(this));

				socket.emit('changeBorrowStatus', {
					BookId: BookId,
					Status: 'Borrow',
					tracking: prompt("โปรดกรอกหมายเลขพัสดุ")
				});

				return false;
			}.bind(this);

			let deleteBook = function(BookId, BookName) {
				if (!window.confirm("คุณต้องการลบ " + BookName + " หรือไม่ ? (" + BookId + ")")) return;

				socket.on("rosDeleteBook", function(data) {
					console.log(data);

					// this.forceUpdate();
					socket.emit('listMyBook', {
						token: localStorage.getItem("login_token")
					});
					socket.off("rosDeleteBook");
					alert("ลบ " + BookName + " แล้ว");
				}.bind(this));

				socket.emit('deleteBook', {
					BookId: BookId,
				});
			}.bind(this);

			let showAddressDetail = function(element) {
				// alert("ชื่อผู้รับ:" + element.sendName);
				this.setState({
					sendName: element.sendName,
					sendAddress: element.sendAddress,
					sendPostcode: element.sendPostcode,
					sendTel: element.sendTel,
					showDialog: true
				});
			}.bind(this);

			let list = [];
			data.forEach(element => {
				list.push(
					<li>
						<div className="image">
							<img src={element.image} />
						</div>
						<div className="detail">
							<p><span>ชื่อหนังสือ</span><Link to={"/book/" + element.BookId + "/" + element.name}>{element.name}</Link></p>
							<p><span>เหรียญ</span>{element.credit}</p>
							<p><span>สถานะ</span>{!element.Status ? "ยืมได้" : element.Status === "Waiting" ? "รอจัดส่ง" : element.Status === "Borrow" ? "กำลังให้ยืม" : element.Status === "Return" ? "ส่งคืน" : "-"}</p>
							{element.user ? <p><span>ผู้ยืม</span>{element.user}</p> : "" }
							{element.DateBorrow ? <p><span>วันที่ยืม</span>{new Date(element.DateBorrow).toLocaleDateString('this')}</p> : ""}
							{element.DateReturn ? <p><span>กำหนดคืน</span>{new Date(element.DateReturn).toLocaleDateString('this')}</p> : ""}
							{element.Status === "Waiting" ? <a href="#" onClick={(e) => {e.preventDefault(); changeToBorrow(element.BookId)}}>ส่งให้แล้ว</a> : ""}
							{element.Status === "Waiting" ? <a href="#" onClick={(e) => {e.preventDefault(); showAddressDetail(element)}}>การจัดส่ง</a> : ""}
							<Link to={"/book/" + element.BookId + "/" + element.name + "/edit"}>แก้ไข</Link>
							{/*element.Status === "Return" || !element.Status ? <a href="#" onClick={(e) => { e.preventDefault(); deleteBook(element.BookId, element.name); return false; }}>นำออก</a> : ""*/}
						</div>
					</li>
				);
			});

			this.setState({
				listMyBook: list
			});
		}.bind(this));

		socket.emit('listMyBook', {
			token: localStorage.getItem("login_token")
		});
	}

	render() {
		return (
			<div className="homePage">
				<Header />
				<Navigation />
				<MyProfileMenu />
				<div className="boxListMyBook">
					<ul>
						{this.state.listMyBook}
					</ul>
				</div>
				<div className="boxBtnAddBook">
					<NavLink to="/add-book" className="btn">เพิ่มหนังสือ</NavLink>
				</div>
				<Footer />

				<div className="dialog" style={{display: this.state.showDialog ? "block" : "none" }}>
					<div class="content">
						<span class="close" onClick={(e) => this.setState({showDialog: false }) }>&times;</span>
						<p className="name"><b>ชื่อผู้รับ:</b> {this.state.sendName}</p>
						<p className="address">{this.state.sendAddress}</p>
						<p className="postcode">รหัสไปรษณีย์ {this.state.sendPostcode}</p>
						<p className="tel">โทร. {this.state.sendTel}</p>
					</div>
				</div>
			</div>
		)
	}
}

class addBookPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			listCategory: "",
			name: "",
			category: 0,
			image: "",
			description: "",
			credit: 0,
		}

		this.loadFile = function(e) {
			console.log(e.target.files);

			if (e.target.files && e.target.files[0]) {
				var reader = new FileReader();
			
				reader.onload = function(e) {
					var img = new Image();
					img.onload = (e) => {
						this.setState({ image: reader.result });
						document.getElementById("image-preview-div").innerHTML = "<img src=\"" + reader.result + "\" />"
						document.getElementById("image-preview-div").style.height = "auto";
					}
					img.src = reader.result;
				}.bind(this);
			
				reader.readAsDataURL(e.target.files[0]);
			}
		}.bind(this);

		this.saveBook = function(e) {
			e.preventDefault();

			if (this.state.name.length <= 0) {
				alert("กรุณาใส่ชื่อเรื่อง");
				return;
			}

			if (this.state.category == 0) {
				alert("กรุณาเลือกหมวดหมู่");
				return;
			}

			if (this.state.image.length <= 0) {
				alert("กรุณาใส่รูปภาพ");
				return;
			}

			if (this.state.description.length <= 0) {
				alert("กรุณาใส่รายละเอียด");
				return;
			}

			if (this.state.credit <= 0) {
				alert("กรุณาใส่ราคายืมเป็นเลขจำนวนเต็มบวก");
				return;
			}

			socket.on("rosAddBooks", function(data) {
				console.log(data);

				socket.off("rosAddBooks");
				alert("เพิ่มหนังสือสำเร็จ ! (" + data.BookId + ")");
				window.location = "/book/" + data.BookId + "/" + this.state.name;
			}.bind(this));

			socket.emit('addBook', {
				token: localStorage.getItem("login_token"),
				name: this.state.name,
				category: this.state.category,
				image: this.state.image,
				description: this.state.description,
				credit: this.state.credit,
			});
		}.bind(this);

		socket.on("rosListCategory", function(data) {
			console.log(data);

			let list = [];
			data.forEach(element => {
				list.push(
					<option value={element.CategoryId}>{element.name}</option>
				);
			});

			if (Object.keys(data).length > 0) this.setState({ category: data[0].CategoryId });

			this.setState({
				listCategory: list
			});
		}.bind(this));

		socket.emit('listCategory', { });
	}

	render() {
		return (
			<div className="homePage">
				<Header />
				<Navigation />
				<form className={"profile-edit-form book-add-form"} onSubmit={this.saveBook}>
					<div className="full">
						<legend>เพิ่มหนังสือ</legend>
						<div>
							<label>ชื่อหนังสือ</label>
							<input type="text" onChange={(e) => this.setState({ name: e.target.value }) } value={this.state.name} />
						</div>
					</div>
					<div className="col-image">
						<div className="image-preview" id="image-preview-div" onClick={(e) => document.getElementById("fileUpload").click() }>อัพโหลดรูปภาพ</div>
						<input id="fileUpload" type="file" onChange={this.loadFile} accept="image/*" />
					</div>
					<div className="col-detail">
						<div>
							<label>หมวดหมู่</label>
							<select value={this.state.category} onChange={(e) => this.setState({ category: e.target.value }) }>
								{this.state.listCategory}
							</select>
						</div>
						<div>
							<label>รายละเอียด</label>
							<textarea onChange={(e) => this.setState({ description: e.target.value }) } />
						</div>
						<div>
							<label>ราคายืม (เหรียญ)</label>
							<input type="number" onChange={(e) => this.setState({ credit: parseInt(e.target.value) }) } />
						</div>
					</div>
					<div className="full">
						<div className="boxButton">
							<button type="submit" className="btn">บันทึก</button>
						</div>
					</div>
				</form>
				<Footer />
			</div>
		)
	}
}


class bookEditPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			listCategory: "",
			name: "",
			category: 0,
			image: "",
			description: "",
			credit: 0,
		}

		this.loadFile = function(e) {
			console.log(e.target.files);

			if (e.target.files && e.target.files[0]) {
				var reader = new FileReader();
			
				reader.onload = function(e) {
					var img = new Image();
					img.onload = (e) => {
						this.setState({ image: reader.result });
					}
					img.src = reader.result;
				}.bind(this);
			
				reader.readAsDataURL(e.target.files[0]);
			}
		}.bind(this);

		this.saveBook = function(e) {
			e.preventDefault();

			if (this.state.name.length <= 0) {
				alert("กรุณาใส่ชื่อเรื่อง");
				return;
			}

			if (this.state.category == 0) {
				alert("กรุณาเลือกหมวดหมู่");
				return;
			}

			if (this.state.image.length <= 0) {
				alert("กรุณาใส่รูปภาพ");
				return;
			}

			if (this.state.description.length <= 0) {
				alert("กรุณาใส่รายละเอียด");
				return;
			}

			if (this.state.credit <= 0) {
				alert("กรุณาใส่ราคายืมเป็นเลขจำนวนเต็มบวก");
				return;
			}

			socket.on("rosAddBooks", function(data) {
				console.log(data);

				socket.off("rosAddBooks");
				alert("บันทึกการแก้ไขแล้ว !");
			}.bind(this));

			socket.emit('addBook', {
				token: localStorage.getItem("login_token"),
				name: this.state.name,
				category: this.state.category,
				image: this.state.image,
				description: this.state.description,
				credit: this.state.credit,
				update: true,
				BookId: this.props.match.params.id
			});
		}.bind(this);

		socket.on("rosListCategory", function(data) {
			console.log(data);

			let list = [];
			data.forEach(element => {
				list.push(
					<option value={element.CategoryId}>{element.name}</option>
				);
			});

			if (Object.keys(data).length > 0) this.setState({ category: data[0].CategoryId });

			this.setState({
				listCategory: list
			});

			/* Load old book detail */
			socket.on("rosBookDetail", function(data) {
				console.log(data);
	
				this.setState({
					name: data.name,
					category: data.CategoryId,
					image: data.image,
					description: data.description,
					credit: data.credit,
				});
			}.bind(this));
	
			socket.emit('bookDetail', {
				BookId: this.props.match.params.id
			});
		}.bind(this));

		socket.emit('listCategory', { });
	}

	render() {
		return (
			<div className="homePage">
				<Header />
				<Navigation />
				<form className={"profile-edit-form book-add-form"} onSubmit={this.saveBook}>
					<div className="full">
						<legend>เพิ่มหนังสือ</legend>
						<div>
							<label>ชื่อหนังสือ</label>
							<input type="text" onChange={(e) => this.setState({ name: e.target.value }) } value={this.state.name} />
						</div>
					</div>
					<div className="col-image">
						<div className="image-preview" id="image-preview-div" style={{ height: "auto" }} onClick={(e) => document.getElementById("fileUpload").click() }>
							<img src={this.state.image} />
						</div>
						<input id="fileUpload" type="file" onChange={this.loadFile} accept="image/*" />
					</div>
					<div className="col-detail">
						<div>
							<label>หมวดหมู่</label>
							<select value={this.state.category} onChange={(e) => this.setState({ category: e.target.value }) }>
								{this.state.listCategory}
							</select>
						</div>
						<div>
							<label>รายละเอียด</label>
							<textarea onChange={(e) => this.setState({ description: e.target.value }) } value={this.state.description} />
						</div>
						<div>
							<label>ราคายืม (เหรียญ)</label>
							<input type="number" onChange={(e) => this.setState({ credit: parseInt(e.target.value) }) } value={this.state.credit} />
						</div>
					</div>
					<div className="full">
						<div className="boxButton">
							<button type="submit" className="btn">บันทึกการแก้ไข</button>
						</div>
					</div>
				</form>
				<Footer />
			</div>
		)
	}
}

class myBorrowPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			listMyBook: [],
			name: "",
			category: 0,
			image: "",
			description: "",
			credit: "",
		}

		socket.on("rosListMyBorrow", function(data) {
			console.log(data);

			let changeToReturn = function(BookId, BookName) {
				socket.on("rosChangeBorrowStatus", function(data) {
					console.log(data);

					// this.forceUpdate();
					/*socket.emit('listMyBorrow', {
						token: localStorage.getItem("login_token")
					});*/

					window.location = "/book/" + BookId + "/" + BookName + "/review";
					socket.off("rosChangeBorrowStatus");
				}.bind(this));

				socket.emit('changeBorrowStatus', {
					BookId: BookId,
					Status: 'Return',
					tracking: prompt("โปรดกรอกหมายเลขพัสดุ")
				});
			}.bind(this);

			let showAddressDetail = function(MemId) {
				// alert("ชื่อผู้รับ:" + element.sendName);
				socket.on("rosGetAddressReturn", function(data) {
					console.log(data);

					this.setState({
						sendName: data.name,
						sendAddress: data.address,
						sendPostcode: data.postcode,
						sendTel: data.tel,
						showDialog: true
					});
				}.bind(this));

				socket.emit('getAddressReturn', {
					MemId: MemId
				});
			}.bind(this);

			let list = [];
			data.forEach(element => {
				list.push(
					<li>
						<div className="image">
							<img src={element.image} />
						</div>
						<div className="detail">
							<p><span>ชื่อหนังสือ</span><Link to={"/book/" + element.BookId + "/" + element.name}>{element.name}</Link></p>
							<p><span>เหรียญ</span>{element.credit}</p>
							<p><span>สถานะ</span>{!element.Status ? "ว่าง" : element.Status === "Waiting" ? "รอจัดส่ง" : element.Status === "Borrow" ? "ให้ยืม" : element.Status === "Return" ? "ส่งคืน" : "-"}</p>
							<p><span>ให้ยืม</span>{!element.user ? "-" : element.user}</p>
							<p><span>วันที่ยืม</span>{!element.DateBorrow ? "-" : new Date(element.DateBorrow).toLocaleDateString('this')}</p>
							<p><span>กำหนดคืน</span>{!element.DateReturn ? "-" : new Date(element.DateReturn).toLocaleDateString('this')}</p>
							{element.Status === "Borrow" ? <a href="#" onClick={(e) => {e.preventDefault(); changeToReturn(element.BookId, element.name)}}>ส่งคืนแล้ว</a> : ""}
							{element.Status === "Borrow" ? <a href="#" onClick={(e) => {e.preventDefault(); showAddressDetail(element.MemId)}}>การจัดส่ง</a> : ""}
						</div>
					</li>
				);
			});

			this.setState({
				listMyBorrow: list
			});
		}.bind(this));

		socket.emit('listMyBorrow', {
			token: localStorage.getItem("login_token")
		});
	}

	render() {
		return (
			<div className="homePage">
				<Header />
				<Navigation />
				<MyProfileMenu />
				<div className="boxListMyBook">
					<ul>
						{this.state.listMyBorrow}
					</ul>
				</div>
				<Footer />

				<div className="dialog" style={{display: this.state.showDialog ? "block" : "none" }}>
					<div class="content">
						<span class="close" onClick={(e) => this.setState({showDialog: false }) }>&times;</span>
						<p className="name"><b>ชื่อผู้รับ:</b> {this.state.sendName}</p>
						<p className="address">{this.state.sendAddress}</p>
						<p className="postcode">รหัสไปรษณีย์ {this.state.sendPostcode}</p>
						<p className="tel">โทร. {this.state.sendTel}</p>
					</div>
				</div>
			</div>
		)
	}
}

class addressPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			listAddress: [],
			name: "",
			address: "",
			postcode: "",
			tel: ""
		}

		socket.on("rosListAddress", function(data) {
			console.log(data);

			let deleteAddress = function(AddressId) {
				socket.on("rosDeleteAddress", function(data) {
					console.log(data);

					this.updateList();
					socket.off("rosDeleteAddress");
				}.bind(this));

				if (!window.confirm("คุณต้องการลบที่อยู่นี้หรือไม่ ? (" + AddressId + ")")) return;

				socket.emit('deleteAddress', {
					AddressId: AddressId,
				});
			}.bind(this);

			let list = [];
			data.forEach(element => {
				list.push(
					<li onClick={ (e) => deleteAddress(element.AddressId) }>
						<div className="name">ชื่อ: {element.name}</div>
						<div className="address">ที่อยู่: {element.address}</div>
						<div className="postcode">รหัสไปรษณีย์ {element.postcode}</div>
						<div className="tel">โทร. {element.tel}</div>
					</li>
				);
			});

			this.setState({
				listAddress: list
			});
		}.bind(this));

		this.addAddress = function(e) {
			e.preventDefault();

			socket.on("rosAddAddress", function(data) {
				console.log(data);

				this.updateList();
				socket.off("rosAddAddress");
				this.setState({ 
					name: "",
					address: "",
					postcode: "",
					tel: ""
				});
			}.bind(this));

			socket.emit('addAddress', {
				token: localStorage.getItem("login_token"),
				name: this.state.name,
				address: this.state.address,
				postcode: this.state.postcode,
				tel: this.state.tel
			});
		}.bind(this);

		this.updateList();
	}

	updateList() {
		socket.emit('listAddress', {
			token: localStorage.getItem("login_token")
		});
	}

	render() {
		return (
			<div className="homePage">
				<Header />
				<Navigation />
				<MyProfileMenu />
				<div className="boxListAddress">
					<h1>รายการที่อยู่ทั้งหมด</h1>
					<ul>{this.state.listAddress}</ul>
				</div>
				<form className="profile-edit-form" onSubmit={this.addAddress}>
					<legend>เพิ่มที่อยู่</legend>
					<div>
						<label>ชื่อ-นามสกุล</label>
						<input type="text" onChange={(e) => this.setState({ name: e.target.value }) } value={this.state.name} required />
					</div>
					<div>
						<label>ที่อยู่</label>
						<input type="text" onChange={(e) => this.setState({ address: e.target.value }) } value={this.state.address} required />
					</div>
					<div>
						<label>รหัสไปรษณีย์</label>
						<input type="number" pattern="{5}[0-9]" onChange={(e) => this.setState({ postcode: e.target.value }) } value={this.state.postcode} required />
					</div>
					<div>
						<label>เบอร์โทร</label>
						<input type="text" onChange={(e) => this.setState({ tel: e.target.value }) } value={this.state.tel} required />
					</div>
					<div className="boxButton">
						<button type="submit">บันทึก</button>
					</div>
				</form>
				<Footer />
			</div>
		)
	}
}

class registerPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			re_password: "",
			user: ""
		}

		this.formRegister = function(e) {
			e.preventDefault();

			if (this.state.password !== this.state.re_password) {
				alert("รหัสผ่านไม่ตรงกัน !");
				return;
			}
			
			socket.emit('register', { 
				email: this.state.email, 
				password: this.state.password,
				user: this.state.user
			});
		}.bind(this);
	}

	render() {
		return (
			<div className="homePage">
				<Header />
				<Navigation />
				<div className="boxLogin">	
					<form action="" onSubmit={this.formRegister}>
						<input type="email" name="email" onChange={(e) => this.setState({ email: e.target.value }) } placeholder="Email" required />
						<input type="password" name="password" onChange={(e) => this.setState({ password: e.target.value }) } placeholder="Password" required />
						<input type="password" name="re-password" onChange={(e) => this.setState({ re_password: e.target.value }) } placeholder="Re Password" required />
						<input type="user" name="user" onChange={(e) => this.setState({ user: e.target.value }) } placeholder="Username" required />
						<button type="submit">Register</button>
					</form>
				</div>
				<Footer />
			</div>
		)
	}
}

class loginPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: ""
		};
			

		this.formLogin = function(e) {
			e.preventDefault();
			
			socket.emit('login', { 
				email: this.state.email, 
				password: this.state.password
			});
		}.bind(this);
	}

	render() {
		return (
			<div className="homePage">
				<Header />
				<Navigation />
				<div className="boxLogin">
					<form action="" onSubmit={this.formLogin}>
						<input type="email" name="email" onChange={(e) => this.setState({ email: e.target.value }) } placeholder="Email" required />
						<input type="password" name="password" onChange={(e) => this.setState({ password: e.target.value }) } placeholder="Password" required />
						<button type="submit">Login</button>
					</form>
				</div>
				<Footer />
			</div>
		);
	}
}


const NotFoundPage = (props) => {
	return (
		<h1>404 Not Found</h1>
	)
}

class App extends Component {
	constructor(props) {
		super(props);

		socket.on('rosLogin', function(data) {
			console.log(data)
			if (typeof data.token !== "undefined") {
				localStorage.setItem("login_token", data.token);
				localStorage.setItem("login_expires", data.expires);

				window.location = "/";
			} else {
				window.alert("ผิดพลาด !");
			}
		});
	}

	render() {
		return (
			<Switch>
				<Route exact path="/"                      component={homePage} />
				<Route exact path="/book/:id/:name"        component={bookPage} />
				<Route exact path="/book/:id/:name/edit"   component={bookEditPage} />
				<Route exact path="/book/:id/:name/borrow" component={borrowPage} />
				<Route exact path="/book/:id/:name/review" component={reviewPage} />
				<Route exact path="/category"              component={categoryPage} />
				<Route exact path="/category/:id/:name"    component={categoryPage} />
				<Route exact path="/popular"               component={popularPage} />
				<Route exact path="/max-borrow"            component={maxBorrowPage} />
				<Route exact path="/point"                 component={pointPage} />

				<Route exact path="/profile"               component={profilePage} />
				<Route exact path="/address"               component={addressPage} />
				<Route exact path="/my-book"               component={myBookPage} />
				<Route exact path="/add-book"              component={addBookPage} />
				<Route exact path="/borrow"                component={myBorrowPage} />
				<Route exact path="/new"                   component={newPage} />

				<Route exact path="/login"                 component={loginPage} />
				<Route exact path="/register"              component={registerPage} />
				<Route component={NotFoundPage} />
			</Switch>
		);
	}
}

export default App;
