import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Error from "../components/Error";
import "./SignUpPage.css";

export default function SignUpPage() {
	const navigate = useNavigate();

	const [inputs, setInputs] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [isFirstNameValid, setIsFirstNameValid] = useState(true);
	const [isLastNameValid, setIsLastNameValid] = useState(true);
	const [isEmailValid, setIsEmailValid] = useState(true);
	const [isPasswordValid, setIsPasswordValid] = useState(true);
	const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

	const valdiateFirstName = (input) => {
		if (input.trim().length === 0) {
			setIsFirstNameValid(false);
			return false;
		} else {
			setIsFirstNameValid(true);
			return true;
		}
	};

	const validateLastName = (input) => {
		if (input.trim().length === 0) {
			setIsLastNameValid(false);
			return false;
		} else {
			setIsLastNameValid(true);
			return true;
		}
	};

	const validateEmail = (input) => {
		if (input.indexOf("@") <= 0) {
			setIsEmailValid(false);
			return false;
		}
		if (input.slice(-4) !== ".com") {
			setIsEmailValid(false);
			return false;
		}
		setIsEmailValid(true);
		return true;
	};

	const validatePassword = (input) => {
		if (input.trim().length < 6) {
			setIsPasswordValid(false);
			return false;
		} else {
			setIsPasswordValid(true);
			return true;
		}
	};

	const validatedConfirmPassword = (confirmPassword) => {
		if (confirmPassword !== inputs.password) {
			setIsConfirmPasswordValid(false);
			return false;
		}
		setIsConfirmPasswordValid(true);
		return true;
	};

	const handleInputChange = (event) => {
		setInputs({ ...inputs, [event.target.name]: event.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (
			!(
				valdiateFirstName(inputs.firstName) &&
				validateLastName(inputs.lastName) &&
				validateEmail(inputs.email) &&
				validatePassword(inputs.password) &&
				validatedConfirmPassword(inputs.confirmPassword)
			)
		) {
			return;
		}

		const body = {
			firstName: inputs.firstName,
			lastName: inputs.lastName,
			email: inputs.email,
			password: inputs.password,
			confirmPassword: inputs.confirmPassword,
		};

		fetch("/api/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		}).then((response) => {
			if (response.ok) {
				alert("Account was successfully created");
				navigate("/login");
			} else {
				alert("There was an error creating the account");
			}
		});
	};

	return (
		<div className="sign-up-page">
			<form className="sign-up-form" onSubmit={handleSubmit}>
				<div className="sign-up-form-section">
					<h3 className="sign-up-header">Create an Account</h3>
					<div className="sign-up-name form-section">
						<div className="sign-up-first-name ">
							<label htmlFor="">First Name</label>
							<input
								type="text"
								id="first-name"
								name="firstName"
								value={inputs.firstName}
								onChange={(event) => {
									handleInputChange(event);
									valdiateFirstName(event.target.value);
								}}
								className={isFirstNameValid ? "" : "invalid"}
							></input>
							{!isFirstNameValid && (
								<Error message="* Enter a first name" />
							)}
						</div>
						<div className="sign-up-last-name">
							<label htmlFor="">Last Name</label>
							<input
								type="text"
								id="last-name"
								name="lastName"
								value={inputs.lastName}
								onChange={(event) => {
									handleInputChange(event);
									validateLastName(event.target.value);
								}}
								className={isLastNameValid ? "" : "invalid"}
							></input>
							{!isLastNameValid && (
								<Error message="* Enter a last name" />
							)}
						</div>
					</div>
					<div className="sign-up-email form-section">
						<label htmlFor="">Email</label>
						<input
							type="text"
							id="email"
							name="email"
							value={inputs.email}
							className={isEmailValid ? "" : "invalid"}
							onChange={(event) => {
								handleInputChange(event);
								validateEmail(event.target.value);
							}}
						></input>
						{!isEmailValid && (
							<Error message="* Please enter an email" />
						)}
					</div>
					<div className="sign-up-password form-section">
						<label htmlFor="">Password</label>
						<input
							type="password"
							id="password"
							className={isPasswordValid ? "" : "invalid"}
							name="password"
							value={inputs.password}
							onChange={(event) => {
								handleInputChange(event);
								validatePassword(event.target.value);
							}}
						></input>
						{!isPasswordValid && (
							<Error
								message={
									"* Please enter a password of 7 characters or more"
								}
							/>
						)}
					</div>
					<div className="sign-up-cofnirm-password form-section">
						<label htmlFor="">Confirm Password</label>
						<input
							type="password"
							name="confirmPassword"
							id="confirm-password"
							className={isConfirmPasswordValid ? "" : "invalid"}
							value={inputs.confirmPassword}
							onChange={(event) => {
								handleInputChange(event);
								validatedConfirmPassword(event.target.value);
							}}
						></input>
						{!isConfirmPasswordValid && (
							<Error message={"* Passwords do not match"} />
						)}
					</div>
					<button type="submit" className="sign-up-button">
						Sign Up
					</button>
					<Link className="log-in-text" to="/login">
						Already have an account? Sign In
					</Link>
				</div>
			</form>
		</div>
	);
}
