import React from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import styled from 'react-emotion';

import Item from '../../../components/ProjectSection/see-item';

import {
	P, H3, primaryNavyBlue, LinkButton,
} from '../../../utils/content';

const SectionTitle = styled(H3)`
	color: ${primaryNavyBlue};
`;

const USER_TASKS = gql`
	query {
		me {
			id
			startWorkAt
			endWorkAt
		}
		items {
			id
			status
			name
			description
			unit
			reviewer
		}
	}
`;

const DashboardTasks = () => (
	<Query query={USER_TASKS}>
		{({data, loading}) => {
			if (loading) return <p>Loading</p>;

			const {me, items} = data;

			const now = new Date();

			const startWorkAt = new Date();
			const endWorkAt = new Date();

			startWorkAt.setUTCHours(
				me.startWorkAt.split(':')[0],
				me.endWorkAt.split(':')[1],
				0,
				0,
			);
			endWorkAt.setUTCHours(
				me.endWorkAt.split(':')[0],
				me.endWorkAt.split(':')[1],
				0,
				0,
			);

			const userWorkingTime = (endWorkAt - startWorkAt) / 60 / 60 / 1000;
			// day is over -> show next day
			let timeLeft = userWorkingTime;

			// day ongoing -> show tasks the user can do
			if (now > startWorkAt && now < endWorkAt) {
				timeLeft = (now - startWorkAt) / 60 / 60 / 1000;
			}

			const itemsToDo = [];

			while (
				itemsToDo.reduce((sum, {unit}) => sum + unit, 0)
					* userWorkingTime
					< timeLeft
				&& itemsToDo.length < 8
				&& items[itemsToDo.length]
			) {
				itemsToDo.push(items[itemsToDo.length]);
			}
			const itemsToDoLater = items.slice(
				itemsToDo.length,
				itemsToDo.length + 3,
			);

			return (
				<>
					{now > endWorkAt ? (
						<SectionTitle>Tâches à faire demain</SectionTitle>
					) : (
						<SectionTitle>Tâches à faire aujourd'hui</SectionTitle>
					)}
					{itemsToDo.length ? (
						itemsToDo.map(item => (
							<Item key={item.id} item={item} mode="see" />
						))
					) : (
						<div>
							<P>
								Bravo, vous n'avez plus rien à faire !
								Voulez-vous...
							</P>
							<LinkButton to="/app/projects/create">
								Créer un nouveau projet
							</LinkButton>
						</div>
					)}
					<SectionTitle>Il vous reste du temps ?</SectionTitle>
					{itemsToDoLater.map(item => (
						<Item key={item.id} item={item} mode="see" />
					))}
				</>
			);
		}}
	</Query>
);

export default DashboardTasks;
