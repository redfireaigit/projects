import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to restaurants
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/restaurants");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/restaurants");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  render() {
    const { errors } = this.state;

    return (
        <section className="login-block">
          <div className="container">
            <div className="row">
              <div className="col-md-4 login-sec">
                <h2 className="text-center">Login Now</h2>
                <p className="grey-text text-darken-1">
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
                <form className="login-form" noValidate onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                    <input onChange={this.onChange}
                           value={this.state.email}
                           error={errors.email}
                           id="email"
                           type="email"
                           className={classnames("form-control", {
                             invalid: errors.email || errors.emailnotfound
                           })}/>
                    <span className="red-text">
                      {errors.email}
                          {errors.emailnotfound}
                    </span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>

                    <input onChange={this.onChange}
                           value={this.state.password}
                           error={errors.password}
                           id="password"
                           type="password"
                           className={classnames("", {
                             invalid: errors.password || errors.passwordincorrect
                           })} placeholder=""/>
                    <span className="red-text">
                      {errors.password}
                      {errors.passwordincorrect}
                    </span>
                  </div>


                  <div className="form-check">
                    <button type="submit" className="btn btn-login float-right">Submit</button>
                  </div>

                </form>
                <div className="copy-text">Created with <i className="fa fa-heart"></i> by Bilal</div>
              </div>
              <div className="col-md-8 banner-sec">
                <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                  <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                  </ol>
                  <div className="carousel-inner" role="listbox">
                    <div className="carousel-item active">
                      <img className="d-block img-fluid" src="https://restaurantmaerz.de/wp-content/uploads/2018/05/ueber-uns-restaurant-maerz.jpg"
                           alt="First slide"/>
                      <div className="carousel-caption d-none d-md-block">
                        <div className="banner-text">
                          <h2>This is Heaven</h2>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img className="d-block img-fluid"
                           src="https://restaurantmaerz.de/wp-content/uploads/2018/05/ueber-uns-restaurant-maerz.jpg" alt="First slide"/>
                      <div className="carousel-caption d-none d-md-block">
                        <div className="banner-text">
                          <h2>This is Heaven</h2>
                          <p>Order your favourate Meal</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img className="d-block img-fluid"
                           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Crc5iUIgsrHayVZvTPhSe6df7-0fxT62Wpu0cMVCgeEijE9p_8k5Hnzr0o8_ix6-7AM&usqp=CAU" alt="First slide"/>
                      <div className="carousel-caption d-none d-md-block">
                        <div className="banner-text">
                          <h2>This is Heaven</h2>
                          <p>Welcome to Toptal food Restaurant</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);
