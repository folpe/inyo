import styled from '@emotion/styled/macro';
import React, {useState} from 'react';
import {useMutation, useQuery} from 'react-apollo-hooks';

import AddCollaboratorModal from '../../../components/AddCollaboratorModal';
import ConfirmModal from '../../../components/ConfirmModal';
import IconButton from '../../../components/IconButton';
import {BREAKPOINTS, collabStatuses} from '../../../utils/constants';
import {formatCollabStatus, formatName} from '../../../utils/functions';
import Search from '../../../utils/icons/search.svg';
import {
	ACCEPT_COLLAB_REQUEST,
	CANCEL_REQUEST_COLLAB,
	REJECT_COLLAB_REQUEST,
	REMOVE_COLLABORATION,
} from '../../../utils/mutations';
import {
	A,
	accentGrey,
	Button,
	FilterInput,
	Heading,
	HeadingLink,
	HeadingRow,
	lightGrey,
	P,
	primaryBlack,
	primaryPurple,
	SubHeading,
} from '../../../utils/new/design-system';
import {GET_USER_COLLABORATORS} from '../../../utils/queries';

const Main = styled('div')`
	min-height: 100vh;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 1rem;
	}
`;

const Container = styled('div')`
	max-width: 980px;
	margin: 0 auto;
`;

const Table = styled('table')`
	border-collapse: collapse;
	text-align: left;
	width: 100%;
	margin: 1rem 0 2rem;

	th,
`;

const RowHeader = styled('tr')`
	border-top: 2px solid ${lightGrey};
	border-bottom: 2px solid ${lightGrey};

	&:after {
		content: '';
		display: block;
		background: none;
		width: 50px;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		display: none;
	}
`;

const HeaderCell = styled('th')`
	font-weight: normal;
	color: ${accentGrey};
`;

const Cell = styled('td')`
	:empty::before {
		content: '\\2014';
	}
`;

const ActionCell = styled(Cell)`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	opacity: ${props => (props.unhidden ? 1 : 0)};
`;

const Row = styled('tr')`
	cursor: pointer;
	color: ${primaryBlack};
	border-bottom: 2px solid ${lightGrey};
	position: relative;
	line-height: 1.6;

	td {
		padding: 0.25rem 0;

		@media (max-width: ${BREAKPOINTS}px) {
			&:first-of-type {
				color: ${primaryPurple};
			}
		}
	}

	:hover {
		color: ${primaryPurple};

		${ActionCell} {
			opacity: 1;
		}
	}

	@media (max-width: ${BREAKPOINTS}px) {
		display: grid;
		padding-bottom: 1rem;
	}
`;

const Actions = styled('div')`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;

	* ~ * {
		margin-left: 2rem;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column-reverse;
		justify-content: flex-start;

		* ~ * {
			margin-left: 0;
			margin-bottom: 0.5rem;
		}
	}
`;

const Forms = styled('div')`
	display: grid;
	grid-template-columns: 50% 1fr;
	align-items: center;
	justify-content: space-between;

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		margin-bottom: 2rem;
	}
`;

const Collaborators = () => {
	const {data, error} = useQuery(GET_USER_COLLABORATORS, {suspend: true});
	const [acceptCollabRequest] = useMutation(ACCEPT_COLLAB_REQUEST);
	const [rejectCollabRequest] = useMutation(REJECT_COLLAB_REQUEST);
	const [removeCollab] = useMutation(REMOVE_COLLABORATION);
	const [cancelRequestCollab] = useMutation(CANCEL_REQUEST_COLLAB);

	if (error) throw error;

	const [filter, setFilter] = useState('');
	const [addCollaborator, setAddCollaborator] = useState(false);
	const [confirmRemoveCollaborator, setConfirmRemoveCollaborator] = useState(
		{},
	);
	const [collaboratorToBeRemoved, setCollaboratorToBeRemoved] = useState(
		null,
	);

	const sanitize = str => str
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
	const includesFilter = str => sanitize(str).includes(sanitize(filter));

	const filteredCollaborators = data.me.collaborators.filter(
		({firstName, lastName, email}) => includesFilter(firstName || '')
			|| includesFilter(lastName || '')
			|| includesFilter(email),
	);

	const filteredCollaboratorRequests = data.me.collaboratorRequests.filter(
		({status, requestee: {firstName, lastName, email}}) => (includesFilter(firstName || '')
				|| includesFilter(lastName || '')
				|| includesFilter(email))
			&& status !== collabStatuses.ACCEPTED,
	);

	const filteredCollaborationRequests = data.me.collaborationRequests.filter(
		({status, requester: {firstName, lastName, email}}) => (includesFilter(firstName || '')
				|| includesFilter(lastName || '')
				|| includesFilter(email))
			&& status !== collabStatuses.ACCEPTED,
	);

	return (
		<Main>
			<Container>
				<HeadingRow>
					<HeadingLink to="/app/customers">Clients</HeadingLink>
					<Heading>Collaborateurs</Heading>
				</HeadingRow>
				<Forms>
					<FilterInput
						icon={Search}
						name="filter"
						placeholder="Filtrer par nom, email..."
						type="text"
						onChange={e => setFilter(e.target.value)}
						value={filter}
					/>
					<Actions>
						<Button
							big
							onClick={() => setAddCollaborator(true)}
							id="invite-collaborator-button"
						>
							Inviter un collaborateur
						</Button>
					</Actions>
				</Forms>
				<SubHeading>Collaborateurs</SubHeading>
				<Table>
					<thead>
						<RowHeader>
							<HeaderCell>Prénom et nom</HeaderCell>
							<HeaderCell>Email</HeaderCell>
						</RowHeader>
					</thead>
					<tbody>
						{filteredCollaborators.map(collaborator => (
							<Row
								key={collaborator.id}
								tabIndex="0"
								role="button"
							>
								<Cell>
									{collaborator.firstName}{' '}
									{collaborator.lastName}
								</Cell>
								<Cell>{collaborator.email}</Cell>
								<ActionCell>
									<IconButton
										icon="delete_forever"
										size="tiny"
										danger
										data-test="customer-delete"
										onClick={async (e) => {
											e.stopPropagation();

											setCollaboratorToBeRemoved(
												collaborator,
											);

											const confirmed = await new Promise(
												resolve => setConfirmRemoveCollaborator(
													{
														resolve,
													},
												),
											);

											setConfirmRemoveCollaborator({});
											setCollaboratorToBeRemoved(null);

											if (confirmed) {
												removeCollab({
													variables: {
														collaboratorId:
															collaborator.id,
													},
												});
											}
										}}
									/>
								</ActionCell>
							</Row>
						))}
					</tbody>
				</Table>
				<SubHeading>Requêtes reçues</SubHeading>
				<Table>
					<thead>
						<RowHeader>
							<HeaderCell>Prénom et nom</HeaderCell>
							<HeaderCell>Email</HeaderCell>
							<HeaderCell>Status</HeaderCell>
						</RowHeader>
					</thead>
					<tbody>
						{filteredCollaborationRequests.map(
							({
								status,
								id,
								requester: {firstName, lastName, email},
							}) => (
								<Row key="a" tabIndex="0" role="button">
									<Cell>
										{formatName(firstName, lastName)}
									</Cell>
									<Cell>{email}</Cell>
									<ActionCell unhidden>
										{status !== collabStatuses.REJECTED ? (
											<>
												<Button
													aligned
													onClick={() => acceptCollabRequest({
														variables: {
															requestId: id,
														},
													})
													}
												>
													Accepter
												</Button>
												<Button
													onClick={() => rejectCollabRequest({
														variables: {
															requestId: id,
														},
													})
													}
													red
												>
													Rejeter
												</Button>
											</>
										) : (
											formatCollabStatus(status)
										)}
									</ActionCell>
								</Row>
							),
						)}
					</tbody>
				</Table>
				<SubHeading>Requêtes envoyées</SubHeading>
				<Table>
					<thead>
						<RowHeader>
							<HeaderCell>Prénom et nom</HeaderCell>
							<HeaderCell>Email</HeaderCell>
							<HeaderCell>Statut</HeaderCell>
						</RowHeader>
					</thead>
					<tbody>
						{filteredCollaboratorRequests.map(
							({
								id,
								status,
								requestee: {firstName, lastName, email},
							}) => (
								<Row key="a" tabIndex="0" role="button">
									<Cell>
										{formatName(firstName, lastName)}
									</Cell>
									<Cell>{email}</Cell>
									<Cell>{formatCollabStatus(status)}</Cell>
									<Cell>
										<Button
											onClick={() => cancelRequestCollab({
												variables: {
													collabRequestId: id,
												},
											})
											}
										>
											Annuler
										</Button>
									</Cell>
								</Row>
							),
						)}
					</tbody>
				</Table>

				{addCollaborator && (
					<AddCollaboratorModal
						onDismiss={() => setAddCollaborator(false)}
					/>
				)}

				{confirmRemoveCollaborator.resolve && (
					<ConfirmModal
						onConfirm={confirmed => confirmRemoveCollaborator.resolve(confirmed)
						}
						onDismiss={() => confirmRemoveCollaborator.resolve(false)
						}
					>
						<P>
							Êtes-vous sûr de vouloir supprimer{' '}
							{collaboratorToBeRemoved.email} ? Tous les projets
							et les tâches assignées à ce collaborateur seront
							desassignées.
						</P>
						<P>Êtes-vous sûr de vouloir continuer?</P>
					</ConfirmModal>
				)}
			</Container>
		</Main>
	);
};

export default Collaborators;
