var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

const HOST = 'localhost';
const POTR = 8000;
let sql = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'DBProject'
});

app.get('/', function(req, res){
	res.send("Hello !");
});

app.use('/image', express.static('image'))

let oToken = {
	encode: (MemId) => {
		try {
			return Buffer.from(MemId.toString()).toString('base64');
		} catch(e) {
			return "";
		}
	},
	decode: (token) => {
		try {
			return parseInt(Buffer.from(token, 'base64'));
		} catch(e) {
			return 0;
		}
	}
}
  
io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('login', function(data){
		console.log("Login", data);

		let sqlText = sql.format('SELECT * FROM `member` WHERE `email` = ? AND `password` = ? LIMIT 1;', [ data.email, data.password ]);
		sql.query(sqlText, function(err, results, fields) {
			// console.log(results);

			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosLogin", Object.keys(results).length > 0 ? {
				token: oToken.encode(results[0].MemId),
				expires: 0
			} : { });
		});
	});

	socket.on('register', function(data){
		console.log("Register", data);

		let sqlText = sql.format('INSERT INTO `member` (`MemId`, `email`, `password`, `username`) VALUES (NULL, ?, ?, ?);', [ data.email, data.password, data.user ]);
		sql.query(sqlText, function(err, results, fields) {
			//console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosLogin", Object.keys(results).length > 0 ? {
				token: oToken.encode(results.insertId),
				expires: 0
			} : { });
		});
	});

	socket.on('checkLogin', function(data){
		let MemId = oToken.decode(data.token);
		let sqlText = sql.format('SELECT `email`, `username` As `user`, `debit`, `createdOn` FROM `member` WHERE `MemId` = ? LIMIT 1;', [ MemId ]);
		sql.query(sqlText, function(err, results, fields) {
			// console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosCheckLogin", Object.keys(results).length > 0 ? results[0] : { });
		});
	});

	socket.on('updateProfile', function(data){
		console.log("updateProfile", data);

		let MemId = oToken.decode(data.token);
		let username = data.user;
		let sqlCommand = "";
		if (typeof data.password !== "undefined") {
			sqlCommand = sql.format('UPDATE `member` SET `password` = ?, `username` = ? WHERE `MemId` = ? LIMIT 1;', [ password, username, MemId ]);
		} else {
			sqlCommand = sql.format('UPDATE `member` SET `username` = ? WHERE `MemId` = ? LIMIT 1;', [ username, MemId ]);
		}
		
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosUpdateProfile", true);
		});
	});

	socket.on('listBook', function(data){
		console.log("listBook", data);

		let orderBy = data.orderBy;
		let limit = data.limit;
		let sqlCommand = "";
		if (orderBy === "popular") {
			// sqlCommand = sql.format('SELECT `review`.`BookId`, `book`.`name`, `book`.`image`, `book`.`credit`, AVG(`review`.`point`) As `totalPoint` FROM `book`, `review` WHERE `review`.`BookId` = `book`.`BookId` GROUP BY `review`.`BookId` ORDER BY `totalPoint` DESC LIMIT ?;', [ limit ]);
			sqlCommand = sql.format('SELECT `BookId`, `name`, `image`, `credit`, (SELECT AVG(`point`) FROM `review` WHERE `BookId` = `book`.`BookId`) As `totalPoint` FROM `book` ORDER BY `totalPoint` DESC LIMIT ?;', [ limit ]);
		} else if (orderBy === "new") {
			sqlCommand = sql.format('SELECT `BookId`, `name`, `image`, `credit` FROM `book` ORDER BY `createdOn` DESC LIMIT ?;', [ limit ]);
		} else if (orderBy === "category") {
			let CategoryName = data.CategoryName;
			sqlCommand = sql.format('SELECT `book`.`BookId`, `book`.`name`, `book`.`image`, `book`.`credit` FROM `book`, `category` WHERE `category`.`name` = ? AND `book`.`CategoryId` = `category`.`CategoryId` LIMIT ?;', [ CategoryName, limit ]);
		} else if (orderBy == "max-borrow") {
			sqlCommand = sql.format('SELECT `BookId`, `name`, `image`, `credit`, (SELECT COUNT(*) FROM `borrow` WHERE `BookId` = `book`.`BookId`) As `countBorrow` FROM `book` ORDER BY `countBorrow` DESC LIMIT ?;', [ limit ]);
		} else if (orderBy === "all") {
			sqlCommand = sql.format('SELECT `BookId`, `name`, `image`, `credit` FROM `book` ORDER BY `createdOn` LIMIT ?;', [ limit ]);
		}
		
		if (sqlCommand !== "") {
			sql.query(sqlCommand, function(err, results, fields) {
				console.log(results);
				
				if (err) {
					console.log(err);
					return;
				}

				socket.emit("rosListBook-" + data.rosCode, results);
			});
		} else {
			socket.emit("rosListBook-" + data.rosCode, { });
		}
	});

	socket.on('bookDetail', function(data){
		console.log("bookDetail", data);

		let LoginMemId = oToken.decode(data.token);
		let sqlCommand = sql.format('SELECT `BookId`, `name`, `image`, `credit`, (SELECT AVG(`point`) FROM `review` WHERE `BookId` = `book`.`BookId`) As `totalPoint`, `MemId`, (SELECT `username` FROM `member` WHERE `MemId` =  `book`.`MemId` LIMIT 1) AS  `username`, `book`.`CategoryId`, (SELECT `name` FROM `category` WHERE `CategoryId` =  `book`.`CategoryId` LIMIT 1) As `CategoryName`, `description`, `createdOn`, (SELECT `Status` FROM `borrow` WHERE `BookId` = `book`.`BookId` ORDER BY `BorrowId` DESC LIMIT 1) AS `Status` FROM `book` WHERE `BookId` = ? LIMIT 1;', [ data.BookId ]);
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			if (Object.keys(results).length > 0) {
				results[0].LoginMemId = LoginMemId;
			}
			socket.emit("rosBookDetail", Object.keys(results).length > 0 ? results[0] : { });
		});
	});

	socket.on('addBook', function(data){
		console.log("addBook", data);

		var saveData = function() {
			let MemId = oToken.decode(data.token);
			let CategoryId = data.category;
			let name = data.name;
			let image = data.image;
			let description = data.description;
			let credit = data.credit;

			let sqlCommand = "";
			if (!data.update) {
				sqlCommand = sql.format('INSERT INTO `book` (`MemId`, `CategoryId`, `name`, `image`, `description`, `credit`) VALUES (?, ?, ?, ?, ?, ?)', 
								[ MemId, CategoryId, name, image, description, credit ]);
			} else {
				let BookId = data.BookId;
				sqlCommand = sql.format('UPDATE `book` SET `CategoryId` = ?, `name` = ?, `image` = ?, `description` = ?, `credit` = ? WHERE `BookId` = ? LIMIT 1;', 
								[ CategoryId, name, image, description, credit, BookId ]);;
			}
			sql.query(sqlCommand, function(err, results, fields) {
				console.log(results);
				
				if (err) {
					console.log(err);
					return;
				}

				socket.emit("rosAddBooks", !data.update ? {
					BookId: results.insertId
				} : true);
			});
		}

		// Image upload
		// Save base64 image to disk
		try {
			// Decoding base-64 image
			// Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
			function decodeBase64Image(dataString) {
			  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
			  var response = {};
	
			  if (matches.length !== 3) {
				return new Error('Invalid input string');
			  }
	
			  response.type = matches[1];
			  response.data = new Buffer(matches[2], 'base64');
	
			  return response;
			}
	
			// Regular expression for image type:
			// This regular image extracts the "jpeg" from "image/jpeg"
			var imageTypeRegularExpression      = /\/(.*?)$/;      
	
			// Generate random string
			var crypto = require('crypto');
			var seed = crypto.randomBytes(20);
			var uniqueSHA1String = crypto.createHash('sha1').update(seed).digest('hex');
	
			var imageBuffer = decodeBase64Image(data.image);
			var userUploadedFeedMessagesLocation = './image/';
	
			var uniqueRandomImageName            = 'image-' + uniqueSHA1String;
			// This variable is actually an array which has 5 values,
			// The [1] value is the real image extension
			var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
	
			var userUploadedImagePath = userUploadedFeedMessagesLocation +  uniqueRandomImageName + '.' + imageTypeDetected[1];
	
			// Save decoded binary image to disk
			try {
				require('fs').writeFile(userUploadedImagePath, imageBuffer.data, function() {
					// console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
					data.image = 'http://' + HOST + ':' + POTR + "/image/" + uniqueRandomImageName + '.' + imageTypeDetected[1];

					saveData();
				});
			} catch(error) {
				console.log('ERROR:', error);

				saveData();
			}
	
		} catch(error) {
			console.log('ERROR:', error);

			saveData();
		}

		
	});

	socket.on('deleteBook', function(data){
		console.log("deleteBook", data);

		let sqlCommand = sql.format('DELETE FROM `book` WHERE `BookId` = ? LIMIT 1;', [ data.BookId ]);
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosDeleteBook", true);
		});
	});

	socket.on('listCategory', function(data){
		console.log("listCategory", data);

		sql.query('SELECT * FROM `category`', function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosListCategory", results);
		});
	});

	socket.on('listAddress', function(data){
		console.log("listAddress", data);

		let MemId = oToken.decode(data.token);
		let sqlCommand = sql.format('SELECT * FROM `memaddress` WHERE `MemId` = ?;', [ MemId ]);
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosListAddress", results);
		});
	});

	socket.on('addAddress', function(data){
		console.log("addAddress", data);

		let MemId = oToken.decode(data.token);
		let name = data.name;
		let address = data.address;
		let postcode = data.postcode;
		let tel = data.tel;
		let sqlCommand = sql.format('INSERT INTO `memaddress` (`MemId`, `name`, `address`, `postcode`, `tel`) VALUES (?, ?, ?, ?, ?)', [ MemId, name, address, postcode, tel ]);
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosAddAddress", true);
		});
	});

	socket.on('updateAddress', function(data){
		console.log("updateAddress", data);

		let MemId = oToken.decode(data.token);
		let name = data.name;
		let address = data.address;
		let postcode = data.postcode;
		let tel = data.tel;
		let sqlCommand = sql.format('UPDATE `memaddress` SET `name` = ?, `address` = ?, `postcode` = ?, `tel` = ? WHERE `MemId` = ? LIMIT 1;', [ name, address, postcode, tel, MemId ]);
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosUpdateAddress", true);
		});
	});

	socket.on('deleteAddress', function(data){
		console.log("deleteAddress", data);

		let AddressId = data.AddressId;
		let sqlCommand = sql.format('DELETE FROM `memaddress` WHERE `AddressId` = ? LIMIT 1;', [ AddressId ]);
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosDeleteAddress", true);
		});
	});

	socket.on('addBorrow', function(data){
		console.log("addBorrow", data);

		let MemId = oToken.decode(data.token);
		let BookId = data.BookId;
		let sendName = data.send.name;
		let sendAddress = data.send.address;
		let sendPostcode = data.send.postcode;
		let sendTel = data.send.tel;
		let dateBorrow = data.dateBorrow;
		let dateReturn = data.dateReturn;
		let sqlCommand = sql.format('INSERT INTO `borrow` (`MemId`, `BookId`, `sendName`, `sendAddress`, `sendPostcode`, `sendTel`, `dateBorrow`, `dateReturn`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);', [ MemId, BookId, sendName, sendAddress, sendPostcode, sendTel, dateBorrow, dateReturn ]);
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			let sqlCommand = sql.format('UPDATE `member` SET `debit` = `debit` + (SELECT `credit` FROM `book` WHERE `BookId` = ? LIMIT 1) WHERE `MemId` = (SELECT `MemId` FROM `book` WHERE `BookId` = ? LIMIT 1) LIMIT 1;', [ BookId, BookId ]);
			sql.query(sqlCommand, function(err, results, fields) {
				console.log(results);
				
				if (err) {
					console.log(err);
					return;
				}
				
				let sqlCommand = sql.format('UPDATE `member` SET `debit` = `debit` - (SELECT `credit` FROM `book` WHERE `BookId` = ? LIMIT 1) WHERE `MemId` = ? LIMIT 1;', [ BookId, MemId ]);
				sql.query(sqlCommand, function(err, results, fields) {
					console.log(results);
					
					if (err) {
						console.log(err);
						return;
					}

					socket.emit("rosAddBorrow", true);
				});
			});
		});
	});

	socket.on('listMyBorrow', function(data){
		console.log("listMyBorrow", data);

		let MemId = oToken.decode(data.token);
		let sqlCommand = sql.format('SELECT `book`.`BookId`, `book`.`MemId`, `name`, `image`, `credit`, `Status`,  `DateBorrow`, `DateReturn`, (SELECT `username` FROM `member` WHERE `MemId` =  `book`.`MemId` LIMIT 1) As `user` FROM `borrow`, `book` WHERE `borrow`.`BookId` = `book`.`BookId` AND `borrow`.`MemId` = ? ORDER BY `BorrowId` DESC;', [ MemId ]);
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosListMyBorrow", results);
		});
	});

	socket.on('getAddressReturn', function(data){
		console.log("getAddressReturn", data);

		let MemId = data.MemId;
		let sqlCommand = sql.format('SELECT * FROM `memaddress` WHERE `MemId` = ? ORDER BY `AddressId` LIMIT 1;', [ MemId ]);
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosGetAddressReturn", Object.keys(results).length > 0 ? results[0] : {});
		});
	});

	socket.on('listMyBook', function(data){
		console.log("listWantBorrow", data);

		let MemId = oToken.decode(data.token);
		let sqlCommand = sql.format('SELECT `book`.`BookId`, `name`, `image`, `credit`, `Status`,  `DateBorrow`, `DateReturn`, `sendName`, `sendAddress`, `sendPostcode`, `sendTel`, (SELECT `username` FROM `member` WHERE `MemId` =  `borrow`.`MemId` LIMIT 1) As `user` FROM `book` LEFT OUTER JOIN `borrow` ON `book`.`BookId`=`borrow`.`BookId` AND `Status` IN (\'Borrow\', \'Waiting\') WHERE `book`.`MemId` = ?', [ MemId ]);
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);

			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosListMyBook", results);
		});
	});

	socket.on('changeBorrowStatus', function(data){
		console.log("changeBorrowStatus", data);

		let BookId = data.BookId;
		let Status = data.Status;
		let sqlCommand = "";
		if (typeof data.tracking !== "undefined") {
			let TrackingNumber = data.tracking;
			sqlCommand = sql.format('UPDATE `borrow` SET `TrackingNumber` = ?, `Status` = ? WHERE `BookId` = ?  ORDER BY `BorrowId` DESC LIMIT 1;', [ TrackingNumber, Status, BookId ]);
		} else {
			sqlCommand = sql.format('UPDATE `borrow` SET `Status` = ? WHERE `BookId` = ?  ORDER BY `BorrowId` DESC LIMIT 1;', [ Status, BookId ]);
		}
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosChangeBorrowStatus", true);
		});
	});

	socket.on('addReview', function(data){
		console.log("addReview", data);

		let MemId = oToken.decode(data.token);
		let BookId = data.BookId;
		let point = data.point;
		let comment = data.comment;

		let sqlCommand = sql.format('INSERT INTO `review` (`BookId`, `MemId`, `point`, `comment`) VALUES (?, ?, ?, ?);', [ BookId, MemId, point, comment ]);
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosAddReview", true);
		});
	});

	socket.on('listReview', function(data){
		console.log("listReview", data);

		let BookId = data.BookId;
		let sqlCommand = sql.format('SELECT `point`, `comment`, (SELECT `username` FROM `member` WHERE `MemId` =  `review`.`MemId` LIMIT 1) As `user`, `createdOn` FROM `review` WHERE `BookId` = ?;', [ BookId ]);
		sql.query(sqlCommand, function(err, results, fields) {
			console.log(results);
			
			if (err) {
				console.log(err);
				return;
			}

			socket.emit("rosListReview", results);
		});
	});
});
  
http.listen(POTR, function(){
	console.log('listening on *:', POTR);
});