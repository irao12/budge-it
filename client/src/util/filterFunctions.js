import {
	isThisYear,
	getMonth,
	isThisMonth,
	getWeekOfMonth,
	getWeeksInMonth,
	isThisWeek,
	getDay,
} from "date-fns";

const separateExpendituresByDay = (expenditures) => {
	const daysOfWeek = {
		0: "Sunday",
		1: "Monday",
		2: "Tuesday",
		3: "Wednesday",
		4: "Thursday",
		5: "Friday",
		6: "Saturday",
	};
	const weekSummary = [];
	for (let i = 0; i < 7; i++) {
		weekSummary.push({ name: daysOfWeek[i], expenditures: [] });
	}
	expenditures.forEach((expenditure) => {
		const currDate = new Date(expenditure.date.replace(/-/g, "/"));
		if (!isThisWeek(currDate)) return;
		const currDay = getDay(currDate);
		weekSummary[currDay].expenditures.push(expenditure);
	});

	return weekSummary;
};

const separateExpendituresByWeek = (expenditures) => {
	const num_weeks = getWeeksInMonth(new Date());
	const monthSummary = [];
	for (let i = 0; i < num_weeks; i++) {
		monthSummary.push({ name: `Week ${i + 1}`, expenditures: [] });
	}
	expenditures.forEach((expenditure) => {
		const currDate = new Date(expenditure.date.replace(/-/g, "/"));
		if (!isThisMonth(currDate)) return;
		const currWeek = getWeekOfMonth(currDate);
		if (currWeek === 0) {
			monthSummary[num_weeks - 1].expenditures.push(expenditure);
		}
		monthSummary[currWeek - 1].expenditures.push(expenditure);
	});
	return monthSummary;
};

const separateExpendituresByMonth = (expenditures) => {
	const monthOfYear = {
		0: "January",
		1: "February",
		2: "March",
		3: "April",
		4: "May",
		5: "June",
		6: "July",
		7: "August",
		8: "September",
		9: "October",
		10: "November",
		11: "December",
	};
	const yearSummary = [];
	for (let i = 0; i < 12; i++) {
		yearSummary.push({ name: monthOfYear[i], expenditures: [] });
	}

	expenditures.forEach((expenditure) => {
		const currDate = new Date(expenditure.date.replace(/-/g, "/"));
		if (!isThisYear(currDate)) return;
		const currMonth = getMonth(currDate);
		if (currMonth === 0) {
			yearSummary[0].expenditures.push(expenditure);
		}
		yearSummary[currMonth].expenditures.push(expenditure);
	});
	console.log(yearSummary);
	return yearSummary;
};

export {
	separateExpendituresByDay,
	separateExpendituresByMonth,
	separateExpendituresByWeek,
};
