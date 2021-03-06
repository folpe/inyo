import styled from '@emotion/styled/macro';
import moment from 'moment';
import React from 'react';

import {BREAKPOINTS} from '../../utils/constants';

const LegendList = styled('ul')`
	padding: 0;
	margin: 0;
`;

const Ratio = styled('span')`
	opacity: 0.5;
	margin-left: 1rem;
	font-size: 0.75rem;
`;

const LegendRow = styled('li')`
	display: grid;
	grid-template-columns: 10px 1fr 30px;
	grid-gap: 8px;
	align-items: baseline;
	list-style-item: none;
	margin-bottom: 0.2rem;

	&:hover {
		${Ratio} {
			opacity: 1;
		}
	}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		grid-template-columns: 10px 60% 30px;
	}
`;

const Label = styled('span')`
	display: inline-block;
	min-width: 10px;
	min-height: 10px;
	border-radius: 50%;
	background-color: ${props => (props.colorScale ? props.colorScale : 'grey')};
	font-size: 0.8rem;
`;

function Legend({list, colorScale, workingTime}) {
	return (
		<LegendList>
			{list.map((item, index) => (
				<LegendRow>
					<Label colorScale={colorScale[index]} />
					{item.x}{' '}
					<Ratio>
						{workingTime
							? moment
								.duration(item.y * workingTime, 'hours')
								.format('h[h]m[m]')
							: `${(item.y * 100).toFixed(1)}%`}
					</Ratio>
				</LegendRow>
			))}
		</LegendList>
	);
}

export default Legend;
