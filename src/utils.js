//Utility functions for parsing data
function parseall(d){
	return {
		country: d.country,
		total_number: d.total_number,
		continent: d.continent
	}
}

function parsecontinent(d){
	return {
		Year: d.Year,
		number: d.number,
		continent: d.continent
	}
}

function parsetotalyear(d){
	return {
		Year: d.Year,
		number: d.number,
		country: d.country
	}
}

function parsetrack(d){
	return {
		Year: d.Year,
		track_number: d.track_number
	}
}

export {
	parseall,
	parsecontinent,
	parsetotalyear,
  parsetrack
}