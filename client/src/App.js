import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import BudgetsPage from "./pages/BudgetsPage";
import BudgetPage from "./pages/BudgetPage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Navbar />
				<Routes>
					<Route index path="/" element={<HomePage />}></Route>
					<Route path="/login" element={<LoginPage />}></Route>
					<Route path="/signup" element={<SignUpPage />}></Route>
					<Route
						path="budgets"
						element={
							<PrivateRoute>
								<BudgetsPage />
							</PrivateRoute>
						}
					></Route>
					<Route
						path="/budgets/:id"
						element={
							<PrivateRoute>
								<BudgetPage />
							</PrivateRoute>
						}
					></Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
