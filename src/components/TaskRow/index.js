import styled from '@emotion/styled/macro';
import React, {
	forwardRef, useCallback, useRef, useState,
} from 'react';
import {useMutation} from 'react-apollo-hooks';
import {Link, withRouter} from 'react-router-dom';

import {BREAKPOINTS, ITEM_TYPES, itemStatuses} from '../../utils/constants';
import {isCustomerTask} from '../../utils/functions';
import DragIconSvg from '../../utils/icons/drag.svg';
import {
	FINISH_ITEM,
	FOCUS_TASK,
	UNFINISH_ITEM,
	UPDATE_ITEM,
} from '../../utils/mutations';
import {
	accentGrey,
	Button,
	ButtonLink,
	lightGrey,
	mediumGrey,
	primaryBlack,
	primaryGrey,
	TaskHeading,
	TaskIconText,
} from '../../utils/new/design-system';
import CollaboratorAvatar from '../CollaboratorAvatar';
import CustomerModalAndMail from '../CustomerModalAndMail';
import MaterialIcon from '../MaterialIcon';
import Plural from '../Plural';
import Tag from '../Tag';
import TaskComment from '../TaskComment';
import TaskDescription from '../TaskDescription';
import TaskInfosInputs from '../TaskInfosInputs';
import TaskReminderIcon from '../TaskReminderIcon';
import Tooltip from '../Tooltip';

export const TaskContainer = styled('div')`
	display: flex;
	position: relative;
	padding-left: 2rem;
	margin-left: -2rem;

	&:after {
		content: '';
		display: block;
		width: 0.8rem;
		height: 1.2rem;
		background: ${props => (props.isDraggable ? `url(${DragIconSvg})` : 'none')};
		background-repeat: no-repeat;
		position: absolute;
		left: -3rem;
		top: 0;
		bottom: 0;
		margin: auto;
		cursor: ${props => (props.isDraggable ? 'grab' : 'default')};

		opacity: 0;
		transition: all 300ms ease;
	}

	&:hover {
		&:after {
			opacity: 1;
			left: 0.2rem;
		}
	}

	@media (max-width: ${BREAKPOINTS}px) {
		padding-left: 0;
		margin-left: 0;
		margin-bottom: 0;

		&:after {
			display: none;
		}
	}
`;

const TaskAdd = styled('div')``;

const TaskIcon = styled('div')`
	cursor: pointer;
	width: 3.5rem;
	height: 3.5rem;
	margin-left: -0.8725rem;
	margin-right: ${props => (props.noData ? '.5rem' : '1rem')};
	overflow: visible;
	background: center no-repeat
		url(${(props) => {
		let {type} = props;

		if (props.assigned) {
			type += '_ASSIGNED';
		}

		const typeInfos
				= ITEM_TYPES.find(t => t.type === type) || ITEM_TYPES[0];

		let icon = typeInfos.iconUrl;

		if (props.status === itemStatuses.FINISHED) {
			icon
					= (props.justUpdated
					? typeInfos.iconUrlValidatedAnim
					: typeInfos.iconUrlValidated) || typeInfos.iconUrl;
		}
		return icon;
	}});
	margin-bottom: 0;

	transform: scale(${props => (props.noData ? 0.75 : '')});

	&:after,
	&:before {
		content: '';
		display: ${props => (props.noData ? 'none' : 'block')};
		display: block;
		border-left: 1px dotted ${mediumGrey};
		position: absolute;
		left: 2.85rem;
	}

	&:before {
		height: 1rem;
		top: 0;
	}

	&:after {
		top: 62px;
		bottom: -10px;
	}

	&:hover {
		background: center no-repeat
			url(${(props) => {
		const typeInfos
					= ITEM_TYPES.find(t => t.type === props.type)
					|| ITEM_TYPES[0];

		let icon = typeInfos.iconUrl;

		icon = typeInfos.iconUrlValidated || typeInfos.iconUrl;
		return icon;
	}});

		animation: ${props => (props.status === itemStatuses.FINISHED ? 'none' : 'growth 300ms')};

		@keyframes growth {
			0% {
				background-size: 0% auto;
			}
			50% {
				background-size: 50% auto;
			}
			70% {
				background-size: 40% auto;
			}
			100% {
				background-size: 50% auto;
			}
		}
	}

	@media (max-width: ${BREAKPOINTS}px) {
		transform: scale(0.6);
		margin: 0;
		position: absolute;
		left: -1rem;

		&:after,
		&:before {
			display: none;
		}
	}
`;

const TaskHeadingPlaceholder = styled(TaskHeading.withComponent(Link))`
	text-decoration: none;
	font-style: italic;
	margin: 0.5rem 0;
	margin: ${props => (props.noData ? '0.1rem 0' : '0.5rem 0')};
	color: ${primaryGrey};

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 1rem;
		display: block;
	}
`;

const TaskHeadingLink = styled(TaskHeading.withComponent(Link))`
	text-decoration: ${props => (props.status === itemStatuses.FINISHED ? 'line-through' : 'none')};
	margin-right: 0.5rem;
	color: ${primaryBlack};
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 0.85rem;
		display: block;
	}
`;

const TaskContent = styled('div')`
	flex: 1;
	margin-top: 0.4rem;
	display: grid;
	grid-template-columns: minmax(200px, auto) minmax(100px, 200px) 80px 110px;
	grid-gap: 15px;
	align-items: center;
	position: relative;
	cursor: pointer;

	&:hover {
		&:before {
			content: '';
			display: block;
			background: ${lightGrey};
			position: absolute;
			left: -1rem;
			top: 0;
			right: -1rem;
			bottom: 0;
			border-radius: 8px;
			z-index: -1;
		}
	}

	@media (max-width: ${BREAKPOINTS}px) {
		padding-left: 2rem;
	}
`;

const ProjectName = styled('p')``;

const CustomerCondensed = styled('div')`
	display: flex;
	align-items: center;
`;

const CustomerAvatar = styled(CollaboratorAvatar)`
	margin-right: 0;
`;

const TaskHeader = styled('div')`
	display: flex;
	align-items: center;
`;

const TaskMetas = styled('div')`
	display: grid;
	grid-template-columns: repeat(4, 28px);
`;

function TaskRow({
	item,
	location,
	isDraggable,
	noData,
	baseUrl = 'tasks',
	forwardedRef,
	userId,
}) {
	const [finishItem] = useMutation(FINISH_ITEM);
	const [unfinishItem] = useMutation(UNFINISH_ITEM);

	const [justUpdated, setJustUpdated] = useState(false);

	const iconRef = useRef();

	const finishItemCallback = useCallback(() => {
		finishItem({
			variables: {
				itemId: item.id,
			},
			optimisticResponse: {
				finishItem: {
					...item,
					status: 'FINISHED',
				},
			},
		});
		setJustUpdated(true);
	}, [finishItem, item]);

	const taskUrlPrefix = '/app';
	const isFinishable
		= item.status !== 'FINISHED' && !isCustomerTask(item.type);
	const isUnfinishable
		= item.status === 'FINISHED' && !isCustomerTask(item.type);

	return (
		<div ref={forwardedRef}>
			<TaskContainer noData={noData} isDraggable={isDraggable}>
				<TaskAdd />
				<TaskIcon
					status={item.status}
					type={item.type}
					assigned={item.assignee && item.assignee.id !== userId}
					noData={noData}
					ref={iconRef}
					justUpdated={justUpdated}
					onClick={() => {
						if (!isFinishable && !isUnfinishable) return;

						if (isFinishable) {
							finishItemCallback();
						}
						else if (isUnfinishable) {
							unfinishItem({
								variables: {
									itemId: item.id,
								},
							});
						}
					}}
				/>
				<Tooltip label="Cliquer pour voir le contenu de la tâche">
					<TaskContent>
						<TaskHeader>
							{item.name ? (
								<TaskHeadingLink
									noData={noData}
									small={false}
									status={item.status}
									to={{
										pathname: `${taskUrlPrefix}/${baseUrl}/${item.id}`,
										state: {prevSearch: location.search},
									}}
								>
									{item.name}
								</TaskHeadingLink>
							) : (
								<TaskHeadingPlaceholder
									noData={noData}
									small={false}
									to={{
										pathname: `${taskUrlPrefix}/tasks/${item.id}`,
										state: {prevSearch: location.search},
									}}
								>
									Choisir un titre pour cette tâche
								</TaskHeadingPlaceholder>
							)}
							{item.tags.map(tag => (
								<Tag tag={tag} key={tag.id}>
									{tag.name}
								</Tag>
							))}
						</TaskHeader>
						<ProjectName>
							{item.section && item.section.project ? (
								item.section.project.name
							) : (
								<>&mdash;</>
							)}
						</ProjectName>
						{!noData && (
							<>
								<CustomerCondensed>
									<MaterialIcon
										style={{marginTop: '5px'}}
										icon="person"
									/>
									{item.linkedCustomer
									|| (item.section
										&& item.section.project.customer) ? (
											<CustomerAvatar
												collaborator={
													item.linkedCustomer
												|| (item.section
													&& item.section.project
														.customer)
												}
												size={24}
											/>
										) : (
										<>&mdash;</>
										)}
								</CustomerCondensed>
								<TaskMetas>
									<TaskComment
										key={`TaskComment-${item.id}`}
										taskUrlPrefix={taskUrlPrefix}
										baseUrl={baseUrl}
										item={item}
										noComment
										locationSearch={location.search}
									/>
									{item.description ? (
										<TaskDescription
											taskUrlPrefix={taskUrlPrefix}
											baseUrl={baseUrl}
											item={item}
											locationSearch={location.search}
										/>
									) : (
										<div />
									)}
									<TaskReminderIcon
										item={item}
										taskUrlPrefix={taskUrlPrefix}
										baseUrl={baseUrl}
										locationSearch={location.search}
									/>
									{item.attachments.length > 0 ? (
										<Tooltip label="Fichiers joints">
											<TaskIconText
												inactive={false}
												icon={
													<MaterialIcon
														icon="attach_file"
														size="tiny"
														color={accentGrey}
													/>
												}
												content={
													<>
														{
															item.attachments
																.length
														}{' '}
														<Plural
															singular="fichier"
															plural="fichiers"
															value={
																item.attachments
																	.length
															}
														/>
													</>
												}
											/>
										</Tooltip>
									) : (
										<div />
									)}
								</TaskMetas>
							</>
						)}
					</TaskContent>
				</Tooltip>
			</TaskContainer>
		</div>
	);
}

const RouterTask = withRouter(TaskRow);

export default forwardRef((props, ref) => (
	<RouterTask forwardedRef={ref} {...props} />
));
