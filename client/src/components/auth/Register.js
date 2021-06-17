import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
      role: "user"
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to restaurants
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/restaurants");
    }
  }

  componentWillReceiveProps(nextProps) {
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

    const { password, role, password2, email, name } = this.state;
    const newUser = {
      name: name,
      email: email,
      password: password,
      password2: password2,
      role: role
    };

    const { history, registerUser: registerUserAction } = this.props;
    registerUserAction(newUser, history);
  };

  onCheckboxChange = e => {
    this.setState({ role: e.target.checked ? "manager" : "user" });
  };

  render() {
    const { password, role, password2, email, name, errors } = this.state;
    return (
      <section className="login-block">
          <div className="container" style={{width: '50%'}}>
            <div className="row">
              <div className="col-md-12 login-sec">
                <h2 className="text-center">Register Now</h2>
                <p className="grey-text text-darken-1">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
                <form className="login-form" noValidate onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1" className="text-uppercase">Name</label>
                    <input
                        onChange={this.onChange}
                        value={name}
                        error={errors.name}
                        id="name"
                        type="text"
                        className={classnames("", {
                          invalid: errors.name
                        })}
                    />
                  </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                <input
                    onChange={this.onChange}
                    value={email}
                    error={errors.email}
                    id="email"
                    type="email"
                    className={classnames("", {
                      invalid: errors.email
                    })}
                />
               </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1" className="text-uppercase">Password</label>
                <input
                    onChange={this.onChange}
                    value={password}
                    error={errors.password}
                    id="password"
                    type="password"
                    className={classnames("", {
                      invalid: errors.password
                    })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1" className="text-uppercase">Confirm Password</label>
                <input
                    onChange={this.onChange}
                    value={password2}
                    error={errors.password2}
                    id="password2"
                    type="password"
                    className={classnames("", {
                      invalid: errors.password2
                    })}
                />
              </div>
              <div className="form-group">
                <label style={{ margin: 15 }} htmlFor="role">

                <input
                    onChange={this.onCheckboxChange}
                    value={role === "manager"}
                    error={errors.role}
                    id="role"
                    type="checkbox"
                    className={classnames("", {
                      invalid: errors.role
                    })}
                />
                <span> Is Restaurant Manager</span>
                </label>
              </div>
                  <div className="form-check">
                    <button type="submit" className="btn btn-login float-right">Submit</button>
                  </div>

                </form>
                <div className="copy-text">Created with <i className="fa fa-heart"></i> by Bilal</div>
              </div>
            </div>
          </div>
        </section>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
