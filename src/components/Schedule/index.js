import styled from '@emotion/styled/macro';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {Link} from 'react-router-dom';

import fbt from '../../fbt/fbt.macro';
import {useMutation} from '../../utils/apollo-hooks';
import {BREAKPOINTS, DRAG_TYPES} from '../../utils/constants';
import {Loading} from '../../utils/content';
import {extractScheduleFromWorkingDays} from '../../utils/functions';
import GoogleGLogo from '../../utils/images/google_g_logo.svg';
import {UNFOCUS_TASK} from '../../utils/mutations';
import {
	accentGrey,
	Button,
	lightGrey,
	mediumGrey,
	P,
	primaryBlack,
	primaryGrey,
	primaryPurple,
	primaryWhite,
	TaskCardElem,
} from '../../utils/new/design-system';
import useAccount from '../../utils/useAccount';
import useCalendar from '../../utils/useCalendar';
import useUserInfos from '../../utils/useUserInfos';
import AssignedToOtherCard from '../AssignedToOtherCard';
import CreateTask from '../CreateTask';
import DeadlineCard from '../DeadlineCard';
import DefaultDroppableDay from '../DefaultDroppableDay';
import HelpAndTooltip from '../HelpAndTooltip';
import IconButton from '../IconButton';
import MaterialIcon from '../MaterialIcon';
import RawPieChart from '../PieChart';
import ReminderCard from '../ReminderCard';
import TaskCard from '../TaskCard';
import Tooltip from '../Tooltip';
import {
	UnitAvailableDisplay,
	UnitOvertimeDisplay,
	UnitWorkedDisplay,
} from '../UnitDisplay';

const googleLogo = <img src={GoogleGLogo} />;

const Container = styled('div')`
	margin-top: 3rem;
	max-width: 100vw;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		margin-top: 0;
	}
`;

const Week = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: center;
	border-radius: 8px;
	min-height: 180px;
	position: relative;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		flex-flow: column;
		background-color: transparent;
	}
`;

const DayTitle = styled('span')`
	color: inherit;
	text-transform: uppercase;
	font-size: 1.25rem;
	display: block;
	text-align: left;
	margin: 0.4rem 0;
	padding: 0.1rem 0.5rem 0;
	border-radius: 4px;

	${props => props.selected
		&& `
		color: ${primaryWhite};
		background: ${primaryPurple};
		font-weight: 500;
	`}

	i {
		display: none !important;
	}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		text-align: left;
		font-size: 1.25rem;
		margin: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border: 1px solid ${lightGrey};
		color: ${primaryGrey};

		i {
			display: flex !important;
		}
	}
`;

const DayTasks = styled('div')`
	color: ${accentGrey};
	display: ${props => (props.isPastDay ? 'none' : 'flex')};
	flex-direction: column;
	flex: 1;
`;

const Day = styled('div')`
	color: ${accentGrey};
	padding: 0 5px;
	flex: 1;
	margin: 0;
	display: flex;
	flex-flow: column;
	position: relative;

	&:after {
		content: '';
		position: absolute;
		right: -1px;
		top: 10px;
		bottom: 10px;
		border-right: 1px solid ${mediumGrey};
	}

	&:last-child {
		&:after {
			display: none;
		}
	}

	${props => props.isOff
		&& `
		background: repeating-linear-gradient(
		  45deg,
		  ${mediumGrey},
		  ${mediumGrey} 20px,
		  transparent 20px,
		  transparent 40px
		);
	`}

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		margin: 0;

		@media (max-width: ${BREAKPOINTS.mobile}px) {
			margin-bottom: ${props => (props.isOpen ? '0' : '1rem')};
		}

		&:after {
			display: none;
		}

		${DayTasks} {
			display: ${props => (props.isOpen ? 'flex' : 'none')}
		}
		${DayTitle} {
			margin-bottom: ${props => props.isOpen && '1rem'};
		}
	}
`;

const ScheduleNav = styled('div')`
	display: flex;
	margin-bottom: 1rem;
	color: ${primaryPurple};
	justify-content: flex-end;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		${Button} {
			width: auto;
		}
	}
`;

const ScheduleNavInfo = styled('div')`
	margin: 0 1rem;
	text-transform: uppercase;

	display: flex;
	align-items: center;
`;

const DayInfos = styled('div')`
	display: flex;
	align-items: center;
	flex-direction: row;
	flex: 1;

	font-size: 0.75rem;
	line-height: 1.4;
	color: ${primaryGrey};
`;

const DayTime = styled('div')`
	display: flex;
	flex: 1;
`;

const Icon = styled('div')`
	flex: 0 0 18px;
	margin: 13px 10px;
	margin-left: 0;
`;

const PieChart = styled(RawPieChart)`
	flex: 0 0 18px;
	margin: 13px 10px;
	margin-left: 0;
`;

const EmptyWeekBanner = styled(P)`
	text-align: center;
	border-radius: 8px;
	background-color: rgba(80, 32, 238, 0.1);
	padding: 1rem;
	position: absolute;
	align-self: center;
	border: 2px dashed ${primaryPurple};
	color: ${primaryPurple};
	pointer-events: none;

	@media (max-width: ${BREAKPOINTS.mobile}px) {
		display: none;
	}
`;

const DraggableTaskCard = ({
	id,
	type,
	index,
	scheduledFor,
	onMove,
	onCopy,
	setIsDragging,
	...rest
}) => {
	const [unfocusTask] = useMutation(UNFOCUS_TASK);
	const [, drag] = useDrag({
		item: {id, type: DRAG_TYPES.TASK},
		begin() {
			setIsDragging(true);
			return {
				id,
				type,
				index,
			};
		},
		end(item, monitor) {
			setIsDragging(false);
			if (!monitor.didDrop()) {
				unfocusTask({
					refetchQueries: ['getPlannedTimes'],
					awaitRefetchQueries: true,
					variables: {
						itemId: id,
						from: scheduledFor,
					},
				});
			}

			const result = monitor.getDropResult();

			if (!result) return;

			if (scheduledFor === result.scheduledFor) {
				if (index === result.index || index + 1 === result.index) return;

				onMove({
					index:
						result.index > index ? result.index - 1 : result.index,
					from: scheduledFor,
					scheduledFor: result.scheduledFor,
				});
			}
			else if (result.dropEffect === 'copy') {
				onCopy({
					index:
						result.index > index ? result.index - 1 : result.index,
					from: scheduledFor,
					scheduledFor: result.scheduledFor,
				});
			}
			else {
				onMove({
					index: result.index,
					from: scheduledFor,
					scheduledFor: result.scheduledFor,
				});
			}
		},
	});
	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.TASK,
		collect(monitor) {
			return {
				isOver: monitor.isOver(),
			};
		},
		drop(item) {
			if (typeof item.index !== 'number') {
				return onMove({
					id: item.id,
					type: item.type,
					index,
					scheduledFor,
				});
			}
			return {index, scheduledFor};
		},
	});

	return (
		<TaskCard
			isOver={isOver}
			ref={(node) => {
				drag(node);
				drop(node);
			}}
			index={index}
			date={scheduledFor}
			{...rest}
		/>
	);
};

const DroppableDayTasks = ({children}) => {
	const [{isOver}, drop] = useDrop({
		accept: DRAG_TYPES.TASK,
		collect(monitor) {
			return {
				isOver: monitor.isOver(),
			};
		},
	});

	return (
		<DayTasks ref={drop} isOver={isOver}>
			{children}
		</DayTasks>
	);
};

const EventName = styled('div')`
	color: ${props => (props.isLive ? primaryWhite : primaryBlack)};
	font-weight: ${props => (props.isLive ? 'bold' : 'normal')};
	text-overflow: ellipsis;
	overflow: hidden;
	display: flex;
	align-items: baseline;
	margin-bottom: 5px;
`;

const EventCardElem = TaskCardElem.withComponent('a');

const Logo = styled('div')`
	display: flex;
	justify-content: center;
	align-items: start;
	padding-left: 5px;
	img {
		width: 16px;
	}
`;

const EventCard = ({
	event: {
		name, start, end, link,
	}, logo,
}) => (
	<Tooltip
		label={
			<fbt project="inyo" desc="Google cal event tooltip">
				Ouvrir dans Google Cal
			</fbt>
		}
	>
		<EventCardElem
			isLive={moment().isBetween(start, end)}
			isOver={moment().isAfter(end)}
			href={link}
			target="_blank"
			style={{textDecoration: 'none', color: 'inherit'}}
		>
			<div>
				<EventName isLive={moment().isBetween(start, end)}>
					{name}
				</EventName>
				<div>
					{start.format('LT')} &mdash; {end.format('LT')}
				</div>
			</div>
			<Logo>{logo}</Logo>
		</EventCardElem>
	</Tooltip>
);

const Schedule = ({
	loading,
	startingFrom,
	onChangeWeek,
	days,
	workingDays,
	fullWeek,
	onMoveTask,
	workingTime = 8,
	assistantName,
	setIsDragging,
}) => {
	const {language} = useUserInfos();
	const [, setRefreshState] = useState(new Date().toJSON());

	const startDay = moment(
		moment(startingFrom).isValid() ? startingFrom : undefined,
	).startOf('week');
	const endDay = moment(startDay).endOf('week');

	const [account, signedIn, , loadingAccount] = useAccount();

	const {data: eventsPerDay, loaded} = useCalendar(account, [
		'primary',
		startDay.toISOString(),
		endDay.toISOString(),
	]);

	const weekdays = extractScheduleFromWorkingDays(
		workingDays,
		eventsPerDay,
		startDay,
		days,
		fullWeek,
		endDay,
	);

	// refresh the component every 10 minutes
	useEffect(() => {
		const id = setInterval(() => {
			setRefreshState(new Date().toJSON());
		}, 10 * 60 * 1000);

		return () => clearInterval(id);
	});

	const isWeekEmpty = weekdays.every(
		day => day.tasks.length === 0 && day.events.length === 0,
	);

	// all days in the week are closed except the current day
	const [openDays, setOpenDays] = useState({
		0: false,
		1: false,
		2: false,
		3: false,
		4: false,
		5: false,
		6: false,
		[moment().day()]: true,
	});

	return (
		<Container>
			<ScheduleNav>
				{!loadingAccount && !signedIn && (
					<Link
						style={{flex: 1, alignSelf: 'center'}}
						to="/app/account#calendar"
					>
						<fbt desc="sync your calendar">
							Connecter votre calendrier google pour voir vos
							évènements
						</fbt>
					</Link>
				)}
				<Button
					onClick={() => onChangeWeek(
						moment()
							.startOf('week')
							.format(moment.HTML5_FMT.DATE),
					)
					}
				>
					<fbt project="inyo" desc="notification message">
						Aujourd'hui
					</fbt>
				</Button>
				<IconButton
					icon="navigate_before"
					size="tiny"
					onClick={() => onChangeWeek(
						startDay
							.clone()
							.subtract(1, 'week')
							.format(moment.HTML5_FMT.DATE),
					)
					}
				/>
				<ScheduleNavInfo>
					<fbt project="inyo" desc="notification message">
						Sem.{' '}
						<fbt:param name="weekNumber">
							{startDay.week()}
						</fbt:param>
					</fbt>
				</ScheduleNavInfo>
				<IconButton
					icon="navigate_next"
					size="tiny"
					onClick={() => onChangeWeek(
						startDay
							.clone()
							.add(1, 'week')
							.format(moment.HTML5_FMT.DATE),
					)
					}
				/>
			</ScheduleNav>
			<Week>
				{weekdays.map((day) => {
					const sortedTasks = [...day.tasks];
					const sortedReminders = [...day.reminders];
					const sortedDeadlines = [...day.deadlines];
					const sortedAssignedTasks = [...day.assignedTasks];
					const sortedEvents = [...day.events];

					sortedTasks.sort((a, b) => {
						const aDay = a.scheduledForDays.find(
							d => d.date === day.date,
						);
						const bDay = b.scheduledForDays.find(
							d => d.date === day.date,
						);

						if (!aDay) return 1;
						if (!bDay) return -1;

						return aDay.position - bDay.position;
					});
					sortedReminders.sort((a, b) => (a.sendingDate > b.sendingDate ? 1 : -1));
					sortedDeadlines.sort((a, b) => (a.deadline > b.deadline ? 1 : -1));

					const timeUsedByEvent = sortedEvents.reduce(
						(time, event) => time + event.unit,
						0,
					);
					const timeLeft
						= 1
						- sortedTasks.reduce(
							(time, task) => time
								+ (task.status === 'FINISHED'
								&& task.timeItTook !== null
									? task.timeItTook
									: task.unit)
									/ (task.scheduledForDays.length || 1),
							0,
						)
						- timeUsedByEvent;
					const timeSpent
						= sortedTasks.reduce(
							(time, task) => time
								+ task.timeItTook
									/ (task.scheduledForDays.length || 1),
							0,
						) + timeUsedByEvent;
					const isPastDay = moment(day.momentDate).isBefore(
						moment(),
						'day',
					);
					const isCurrentDay = moment(day.momentDate).isSame(
						moment(),
						'day',
					);

					let stat;

					if (isPastDay && timeSpent > 0) {
						stat = (
							<DayInfos>
								<PieChart value={timeSpent} />
								<p>
									<UnitWorkedDisplay unit={timeSpent} />
								</p>
							</DayInfos>
						);
					}
					else if (!isPastDay && timeLeft > 0 && timeLeft < 1) {
						stat = (
							<DayInfos>
								<DayTime>
									<PieChart value={1 - timeLeft} />
									<p>
										<UnitAvailableDisplay unit={timeLeft} />
									</p>
								</DayTime>
							</DayInfos>
						);
					}
					else if (!isPastDay && timeLeft < 0) {
						stat = (
							<DayInfos>
								<DayTime>
									<PieChart value={1 - timeLeft} />
									<p>
										<UnitOvertimeDisplay unit={-timeLeft} />
									</p>
								</DayTime>
							</DayInfos>
						);
					}
					else if (
						!isPastDay
						&& timeLeft === workingTime
						&& sortedTasks.length > 0
					) {
						stat = (
							<DayInfos>
								<Icon>
									<MaterialIcon
										icon="settings"
										size="tiny"
										color="inherit"
									/>
								</Icon>
								<p>
									<fbt
										project="inyo"
										desc="Add task duration to get info"
									>
										Ajoutez des durées à ces tâches pour
										qu'Inyo vous aide à gérer votre temps.
									</fbt>
								</p>
							</DayInfos>
						);
					}

					return (
						<Day
							isPastDay={isPastDay}
							isOff={!day.workedDay}
							isOpen={openDays[day.momentDate.day()]}
							isCurrentDay={isCurrentDay}
						>
							<DayTitle
								selected={moment().isSame(
									day.momentDate,
									'day',
								)}
							>
								{day.momentDate
									.toDate()
									.toLocaleDateString(language, {
										weekday: 'short',
										day: 'numeric',
										month: moment().isSame(
											day.momentDate,
											'month',
										)
											? undefined
											: 'numeric',
										year: moment().isSame(
											day.momentDate,
											'year',
										)
											? undefined
											: '2-digit',
									})}
								<MaterialIcon
									icon={
										openDays[day.momentDate.day()]
											? 'unfold_less'
											: 'unfold_more'
									}
									size="tiny"
									color={primaryGrey}
									onClick={() => setOpenDays({
										...openDays,
										[day.momentDate.day()]: !openDays[
											day.momentDate.day()
										],
									})
									}
								/>
							</DayTitle>
							<DroppableDayTasks id={day.date}>
								<div>
									{sortedEvents.map(event => (
										<EventCard
											event={event}
											logo={googleLogo}
											workingTime={workingTime}
										/>
									))}
								</div>
								{sortedTasks.map((task, index) => (
									<DraggableTaskCard
										key={task.id}
										id={task.id}
										type={task.type}
										task={task}
										index={index}
										scheduledFor={day.date}
										setIsDragging={setIsDragging}
										onMove={({
											id,
											type,
											index: position,
											from,
											scheduledFor,
										}) => {
											onMoveTask({
												task: id ? {id, type} : task,
												from,
												scheduledFor,
												position:
													typeof position === 'number'
														? position
														: sortedTasks.length,
												action: 'MOVE',
											});
										}}
										onCopy={({
											id,
											type,
											index: position,
											scheduledFor,
										}) => {
											onMoveTask({
												task: id ? {id, type} : task,
												scheduledFor,
												position:
													typeof position === 'number'
														? position
														: sortedTasks.length,
												action: 'SPLIT',
											});
										}}
									/>
								))}
								<DefaultDroppableDay
									index={day.tasks.length}
									scheduledFor={day.date}
									onMove={({
										id,
										type,
										linkedCustomer,
										attachments,
										index: position,
										scheduledFor,
									}) => {
										onMoveTask({
											task: {
												id,
												type,
												linkedCustomer, // we need this
												attachments, // and this to check for activation criteria fulfillment
											},
											scheduledFor,
											position:
												typeof position === 'number'
													? position
													: sortedTasks.length,
										});
									}}
								>
									{stat}
									{!isPastDay && (
										<HelpAndTooltip
											icon="add"
											color={primaryBlack}
											id="add-task-schedule"
										>
											<CreateTask
												popinTask
												withProject
												defaultScheduledFor={day.date}
											/>
										</HelpAndTooltip>
									)}
								</DefaultDroppableDay>
								{sortedReminders.map(reminder => (
									<ReminderCard
										key={reminder.id}
										datetime={reminder.sendingDate}
										reminder={reminder}
										task={reminder.item}
									/>
								))}
								{sortedDeadlines.map(deadline => (
									<DeadlineCard
										key={deadline.id}
										project={deadline.project}
										task={deadline.task}
										date={deadline.date}
									/>
								))}
								{sortedAssignedTasks.map(assignedTask => (
									<AssignedToOtherCard
										key={assignedTask.id}
										task={assignedTask}
									/>
								))}
							</DroppableDayTasks>
						</Day>
					);
				})}
				{!loading && isWeekEmpty && (
					<EmptyWeekBanner>
						<fbt desc="Banner displayed when the dashboard schedule is empty">
							Glisser des tâches dans le calendrier pour
							programmer vos journées et demander à{' '}
							<fbt:param name="assistantName">
								{assistantName}
							</fbt:param>{' '}
							de s'assurer du bon déroulement de votre planning.
						</fbt>
					</EmptyWeekBanner>
				)}
				{loading && <Loading />}
			</Week>
		</Container>
	);
};

Schedule.defaultProps = {
	onChangeWeek: () => {},
	workingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
	fullWeek: false,
	onMoveTask: () => {},
	onCopyTask: () => {},
};

Schedule.propTypes = {
	startingFrom: PropTypes.string,
	onChangeWeek: PropTypes.func,
	workingDays: PropTypes.arrayOf(
		PropTypes.oneOf([
			'MONDAY',
			'TUESDAY',
			'WEDNESDAY',
			'THURSDAY',
			'FRIDAY',
			'SATURDAY',
			'SUNDAY',
		]),
	),
	fullWeek: PropTypes.bool,
	onMoveTask: PropTypes.func,
};

export default Schedule;
