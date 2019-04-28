import {
	parseall,
	parsecontinent,
	parsetotalyear,
  parsetrack
} from './utils';

import {csv} from 'd3';

const trackpromise = csv('./data/refugee_track_number.csv', parsetrack)
  .then(BarChart)
  .catch(err => console.log('Failed with', err))

const continentpromise = csv('./data/continent_year.csv', parsecontinent)
  .then(LineChart)
  .catch(err => console.log('Failed on', err))

const allpromise = csv('./data/all.csv', parseall)
  .then(BubbleChart)
  .catch(err => console.log('Failed on', err))

const yearpromise = csv('./data/refugee_total_year_in100.csv', parsetotalyear)
  .then(Arcbar)
  .catch(err => console.log('Failed on', err))

export {
	allpromise,
	trackpromise,
	continentpromise,
	yearpromise
}