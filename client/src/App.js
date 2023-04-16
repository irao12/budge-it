import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import BudgetsPage from "./pages/BudgetsPage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Navbar />
				<Routes>
					<Route path="/login" element={<LoginPage />}></Route>
					<Route path="/signup" element={<SignUpPage />}></Route>
					<Route
						path="/budgets"
						element={
							<PrivateRoute>
								<BudgetsPage />
							</PrivateRoute>
						}
					></Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
