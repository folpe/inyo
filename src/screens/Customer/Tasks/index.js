import React from 'react';
import styled from '@emotion/styled';
import {Route} from 'react-router-dom';

import {ModalContainer as Modal, ModalElem} from '../../../utils/content';
import TaskView from '../../../components/ItemView';
import CustomerTasks from './tasks';

import {BREAKPOINTS} from '../../../utils/constants';
import {P, primaryGrey, primaryRed} from '../../../utils/new/design-system';

const Container = styled('div')`
	min-height: 100vh;
	padding: 3rem;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 1rem;
	}
`;

const WelcomeMessage = styled(P)`
	color: ${primaryGrey};
	max-width: 1280px;
	margin-left: auto;
	margin-right: auto;
`;

const Red = styled('span')`
	color: ${primaryRed};
`;

const Tasks = ({location, match}) => {
	const {customerToken} = match.params;
	const {prevSearch} = location.state || {prevSearch: location.search};
	const query = new URLSearchParams(prevSearch || location.search);
	const projectId = query.get('projectId');

	return (
		<Container>
			<WelcomeMessage>
				Bonjour,
				<br />
				Les tâches <Red>rouges</Red> sont celles dont vous êtes
				responsables.
			</WelcomeMessage>

			<CustomerTasks projectId={projectId} location={location} />

			<Route
				path="/app/:customerToken/tasks/:taskId"
				render={({
					location: {state = {}},
					history,
					match: {
						params: {taskId},
					},
				}) => (
					<Modal
						onDismiss={() => history.push(
							`/app/${customerToken}/tasks${state.prevSearch
									|| prevSearch
									|| ''}`,
						)
						}
					>
						<ModalElem>
							<TaskView
								id={taskId}
								customerToken={customerToken}
								close={() => history.push(
									`/app/${customerToken}/tasks${state.prevSearch
											|| ''}`,
								)
								}
							/>
						</ModalElem>
					</Modal>
				)}
			/>
		</Container>
	);
};

export default Tasks;
