from flask import Flask, render_template, redirect, request, session, flash, json, jsonify
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from nsetools import Nse
from datetime import datetime
from sqlalchemy import func
from functools import wraps

api = Flask(__name__)


api.config["SESSION_PERMANENT"] = False
api.config["SESSION_TYPE"] = "filesystem"
Session(api)

api.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/stockearn'

db = SQLAlchemy(api)
nse = Nse()

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    hash = db.Column(db.String(120), nullable=False)
    cash = db.Column(db.Integer, default = 1000000)

class Transactions(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(80), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    quote = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    date = db.Column(db.String(20), nullable=True)


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

@api.route("/portfolio")
@login_required
def portfolio():
    stocks = db.session.query(Transactions.symbol,func.sum(Transactions.quantity).label('quantity')).filter_by(user_id=session["user_id"]).group_by(Transactions.symbol).all()
    shares = []
    value = 0
    previous = 0
    for stock in stocks:

        if int(stock.quantity) == 0:
            continue

        quote = nse.get_quote(stock.symbol)
        name = quote.get("companyName")
        price = quote.get("lastPrice")
        total = price*int(stock.quantity)
        shares.append({
            'Symbol':stock.symbol,
            'Name':name,
            'Shares':str(stock.quantity),
            'Price':price,
            'Total':"{:.1f}".format(total)
        })
        value += total
        previous += float(quote.get("previousClose"))*int(stock.quantity)


    cash = Users.query.filter_by(id=session["user_id"]).first()
    balance = int(cash.cash)
    grand_total = value + balance
    previous += cash.cash

    change = grand_total - previous

    pchange = (change/previous)*100
    if pchange >= 0:
        color = "#009688"
    else:
        color = "#FF5252"

    pchange = "{:.2f}".format(pchange)


    overall_change = {'change':grand_total - 1000000}

    grand_total = "{:.2f}".format(grand_total)
    overall_change['percentage'] = "{:.2f}".format((overall_change['change']/1000000)*100)
    change = "{:.2f}".format(change)

    if overall_change['change'] >= 0:
        overall_change['color'] = "#009688"
    else:
        overall_change['color'] = "#FF5252"
    overall_change['change'] = "{:.2f}".format(overall_change['change'])

    shares = [row for row in shares]

    return jsonify(shares=shares, balance=balance, grand_total=grand_total, overall_change=overall_change, change=change, pchange=pchange, color=color)

@api.route("/quote",methods = ["POST"])
@login_required
def quote():
    data = json.loads(request.data)

    if not data.get("symbol"):
        flash("Must provide a symbol","danger")
        return jsonify(error = "Invalid symbol")

    get_quote = nse.get_quote(data.get("symbol"))
    if not get_quote:
        flash("Must provide a valid symbol","danger")
        return jsonify(error = "Invalid symbol")
    
    quote = {
        "symbol": get_quote['symbol'],
        "company": get_quote['companyName'],
        "lastPrice": get_quote['lastPrice'],
        "change": get_quote['change'],
        "pChange": get_quote['pChange'],
        "open": get_quote['open'],
        "close": get_quote['previousClose'],
        "dayHigh": get_quote['intraDayHighLow']['max'],
        "dayLow": get_quote['intraDayHighLow']['min'],
        "yearHigh": get_quote['weekHighLow']['max'],
        "yearLow": get_quote['weekHighLow']['min']
    }

    return jsonify(quote = quote)


@api.route("/buy",methods = ["POST"])
@login_required
def buy():
    data = json.loads(request.data)

    symbol = data.get("symbol")
    qty = data.get("quantity")

    if not symbol:
        flash("Must provide a symbol","danger")
        return redirect("/buy")
    elif not qty:
        flash("Must provide number of shares","danger")
        return redirect("/buy")
    elif int(qty) < 1:
        flash("Must provide a valid number of shares","danger")
        return redirect("/buy")

    quote = nse.get_quote(symbol)
    qty = int(qty)
    if not quote:
        flash("Must provide a valid symbol","danger")
        return jsonify(success = False, error = "Incorrect symbol")

    price = quote.get("lastPrice")
    user = Users.query.filter_by(id = session["user_id"]).first()
    cash = user.cash
    total = qty*price
    date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    if cash >= total:
        user.cash = cash-total
        transaction = Transactions(user_id=session["user_id"],symbol=quote.get("symbol"),quantity=qty,quote=price,total=total,date=date)
        db.session.add(transaction)
        db.session.commit()
        flash("Successfully bought!","success")
        return jsonify(success = True)

    else:
        flash("Not enough cash","danger")
        return jsonify(error = "Insufficient balance")

@api.route("/sell",methods = ["POST"])
@login_required
def sell():
    data = json.loads(request.data)

    symbol = data.get("symbol")
    qty = data.get("quantity")
    stock = db.session.query(func.sum(Transactions.quantity).label('quantity')).filter_by(user_id=session["user_id"],symbol=symbol).group_by(Transactions.symbol).first()
    shares = int(stock.quantity)
    if not symbol:
        return jsonify(success = False, error = "Must provide a symbol")
    elif not qty:
        return jsonify(success = False, error = "Must provide number of shares")
    elif int(qty) < 1:
        return jsonify(success = False, error = "Must provide a valid number of shares")
    elif shares < int(qty):
        return jsonify(success = False, error = "Not enough number of shares in your portfolio")

    qty = int(qty)
    user = Users.query.filter_by(id=session["user_id"]).first()
    price = nse.get_quote(symbol)["lastPrice"]
    cash = user.cash
    total = price*qty
    date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    user.cash = cash+total
    transaction = Transactions(user_id=session["user_id"],symbol=symbol,quantity=-qty,quote=price,total=total,date=date)
    db.session.add(transaction)
    db.session.commit()

    flash("Successfully sold!","success")
    return jsonify(success = True)


@api.route("/getstocks")
@login_required
def get_stocks():
    data = db.session.query(Transactions.symbol,func.sum(Transactions.quantity).label('quantity')).filter_by(user_id=session["user_id"]).group_by(Transactions.symbol).all()
    stocks = []
    for stock in data:
        if int(stock.quantity) != 0:
            stocks.append(stock.symbol)
    
    return jsonify(stocks = stocks)


@api.route("/history")
@login_required
def history():
    transactions = db.session.query(Transactions.symbol,Transactions.quantity,Transactions.quote,Transactions.date).filter_by(user_id=session["user_id"]).order_by(Transactions.date.desc()).all()
    transactions = [tuple(row) for row in transactions]
    return jsonify(transactions = transactions)

@api.route("/leaderboard")
@login_required
def leaderboard():
    leaderboard = db.session.query(Users.username, Users.cash).order_by(Users.cash.desc()).all()
    leaderboard = [tuple(row) for row in leaderboard]
    return jsonify(leaderboard = leaderboard)

@api.route("/login",methods = ["POST"])
def login():
    data = json.loads(request.data)

    user = Users.query.filter_by(username=data.get("username")).first()

    if user == None or not check_password_hash(user.hash,data.get("password")):
        flash("Incorrect username/password","danger")
        return jsonify(error = "Invalid username/password")

    session["user_id"] = Users.query.filter_by(username=data.get("username")).first().id
    flash("Successfully logged in","success")
    return jsonify(success = True, username = data.get("username"))


@api.route("/register",methods = ["POST"])
def register():
    data = json.loads(request.data)

    if Users.query.filter_by(username=data.get("username")).first() == None:
        pwdhash = generate_password_hash(data.get("password"))
        user = Users(username=data.get("username"),hash=pwdhash)
        db.session.add(user)
        db.session.commit()
        flash("Registered successfully!","success")
        session["user_id"] = Users.query.filter_by(username=data.get("username")).first().id
        return jsonify(user_id = session["user_id"])

    else:
        flash("Username already taken!","danger")
        return ("Already exist")

@api.route("/logout")
@login_required
def logout():
    session["user_id"] = None
    flash("Logged out","success")
    return jsonify(success = True)


if __name__ == "__main__":
    api.run(debug = True)
