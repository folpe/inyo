import {Mutation} from '@apollo/react-components';
import styled from '@emotion/styled';
import {Formik} from 'formik';
import React, {Component} from 'react';
import * as Yup from 'yup';

import fbt from '../../fbt/fbt.macro';
import {
	Button, FlexColumn, H4, Label,
} from '../../utils/content';
import {UPDATE_USER_CONSTANTS} from '../../utils/mutations';
import {GET_USER_INFOS} from '../../utils/queries';
import DoubleRangeTimeInput from '../DoubleRangeTimeInput';
import WeekDaysInput from '../WeekDaysInput';

const OnboardingStep = styled('div')`
	width: 100%;
`;
const ActionButtons = styled(FlexColumn)`
	margin-left: auto;
	margin-right: auto;
`;

const ActionButton = styled(Button)`
	width: 200px;
	margin-top: 15px;
	margin-left: auto;
	margin-right: auto;
`;

const StepSubtitle = styled(H4)`
	text-align: center;
`;

const EmojiTimeline = styled('div')`
	display: flex;
	justify-content: space-between;
	font-size: 32px;
	margin: 15px;
	position: relative;
	height: 50px;
`;

const Emoji = styled('span')`
	display: block;
	position: absolute;
	left: calc(${props => props.offset}% - 21px);
	user-select: none;
`;

class OnboardingThirdStep extends Component {
	render() {
		const {
			me: {
				startWorkAt, endWorkAt, startBreakAt, endBreakAt,
			},
			me,
			getNextStep,
			getPreviousStep,
			isFirstStep,
		} = this.props;

		const currentDate = new Date().toJSON().split('T')[0];
		const startWorkAtDate = new Date(`${currentDate}T${startWorkAt}`);
		const endWorkAtDate = new Date(`${currentDate}T${endWorkAt}`);
		const startBreakAtDate = new Date(`${currentDate}T${startBreakAt}`);
		const endBreakAtDate = new Date(`${currentDate}T${endBreakAt}`);

		const startHourInitial
			= startWorkAtDate.toString() === 'Invalid Date'
				? 8
				: startWorkAtDate.getHours();
		const startMinutesInitial
			= startWorkAtDate.toString() === 'Invalid Date'
				? 30
				: startWorkAtDate.getMinutes();
		const endHourInitial
			= endWorkAtDate.toString() === 'Invalid Date'
				? 19
				: endWorkAtDate.getHours();
		const endMinutesInitial
			= endWorkAtDate.toString() === 'Invalid Date'
				? 0
				: endWorkAtDate.getMinutes();
		const breakStartHourInitial
			= startBreakAtDate.toString() === 'Invalid Date'
				? 12
				: startBreakAtDate.getHours();
		const breakStartMinutesInitial
			= startBreakAtDate.toString() === 'Invalid Date'
				? 0
				: startBreakAtDate.getMinutes();
		const breakEndHourInitial
			= endBreakAtDate.toString() === 'Invalid Date'
				? 13
				: endBreakAtDate.getHours();
		const breakEndMinutesInitial
			= endBreakAtDate.toString() === 'Invalid Date'
				? 0
				: endBreakAtDate.getMinutes();
		const workingDaysInitial
			= me.workingDays && me.workingDays.length
				? me.workingDays
				: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

		return (
			<OnboardingStep>
				<StepSubtitle>
					<fbt project="inyo" desc="onboarding first step title">
						Nous avons besoin de quelques informations pour nous
						aider à travailler pour vous.
					</fbt>
				</StepSubtitle>
				<Mutation mutation={UPDATE_USER_CONSTANTS}>
					{updateUser => (
						<Formik
							initialValues={{
								startHour: startHourInitial,
								startMinutes: startMinutesInitial,
								endHour: endHourInitial,
								endMinutes: endMinutesInitial,
								breakStartHour: breakStartHourInitial,
								breakStartMinutes: breakStartMinutesInitial,
								breakEndHour: breakEndHourInitial,
								breakEndMinutes: breakEndMinutesInitial,
								workingDays: workingDaysInitial,
							}}
							validationSchema={Yup.object().shape({
								startHour: Yup.number().required(),
								startMinutes: Yup.number().required(),
								endHour: Yup.number().required(),
								endMinutes: Yup.number().required(),
							})}
							onSubmit={async (values, actions) => {
								actions.setSubmitting(false);
								const {
									startHour,
									startMinutes,
									endHour,
									endMinutes,
									breakStartHour,
									breakStartMinutes,
									breakEndHour,
									breakEndMinutes,
									workingDays,
								} = values;

								const start = new Date();

								start.setHours(startHour);
								start.setMinutes(startMinutes);
								start.setSeconds(0);
								start.setMilliseconds(0);

								const end = new Date();

								end.setHours(endHour);
								end.setMinutes(endMinutes);
								end.setSeconds(0);
								end.setMilliseconds(0);

								const breakStart = new Date();

								breakStart.setHours(breakStartHour);
								breakStart.setMinutes(breakStartMinutes);
								breakStart.setSeconds(0);
								breakStart.setMilliseconds(0);

								const breakEnd = new Date();

								breakEnd.setHours(breakEndHour);
								breakEnd.setMinutes(breakEndMinutes);
								breakEnd.setSeconds(0);
								breakEnd.setMilliseconds(0);

								window.Intercom('update', {
									startHour: `${startHour}:${startMinutes}`,
									endHour: `${endHour}:${endMinutes}`,
									breakStartHour: `${breakStartHour}:${breakStartMinutes}`,
									breakEndHour: `${breakEndHour}:${breakEndMinutes}`,
									workingDays,
								});

								try {
									await updateUser({
										variables: {
											startWorkAt: start
												.toJSON()
												.split('T')[1],
											endWorkAt: end
												.toJSON()
												.split('T')[1],
											startBreakAt: breakStart
												.toJSON()
												.split('T')[1],
											endBreakAt: breakEnd
												.toJSON()
												.split('T')[1],
											workingDays,
										},
									});

									getNextStep();
								}
								catch (error) {
									actions.setSubmitting(false);
									actions.setErrors(error);
									actions.setStatus({
										msg: (
											<fbt
												project="inyo"
												desc="something went wrong message"
											>
												Quelque chose s'est mal passé
											</fbt>
										),
									});
								}
							}}
						>
							{(props) => {
								const {
									handleSubmit,
									setFieldValue,
									values: {
										startHour,
										startMinutes,
										endHour,
										endMinutes,
										breakStartHour,
										breakStartMinutes,
										breakEndHour,
										breakEndMinutes,
										workingDays,
									},
								} = props;

								return (
									<form onSubmit={handleSubmit}>
										<Label onboarding>
											<fbt
												project="inyo"
												desc="onboarding first step description 1st part"
											>
												Définissez vos horaires de
												travail
											</fbt>
											<br />
											<fbt
												project="inyo"
												desc="onboarding first step description 2nd part"
											>
												(cela nous aide à organiser les
												tâches que vous pouvez effectuer
												dans une journée)
											</fbt>
										</Label>
										<DoubleRangeTimeInput
											value={{
												start: [
													startHour,
													startMinutes,
												],
												end: [endHour, endMinutes],
												breakStart: [
													breakStartHour,
													breakStartMinutes,
												],
												breakEnd: [
													breakEndHour,
													breakEndMinutes,
												],
											}}
											setFieldValue={setFieldValue}
										/>
										<EmojiTimeline>
											<Emoji
												role="img"
												aria-label={
													<fbt
														project="inyo"
														desc="morning onboarding aria label"
													>
														matin
													</fbt>
												}
												offset={0}
												children="🌙"
											/>
											<Emoji
												role="img"
												aria-label={
													<fbt
														project="inyo"
														desc="break onboarding aria label"
													>
														petit déjeuner
													</fbt>
												}
												offset={33}
												children="☕"
											/>
											<Emoji
												role="img"
												aria-label={
													<fbt
														project="inyo"
														desc="lunch onboarding aria label"
													>
														déjeuner
													</fbt>
												}
												offset={50}
												children="🍽️"
											/>
											<Emoji
												role="img"
												aria-label={
													<fbt
														project="inyo"
														desc="evening onboard aria label"
													>
														soirée
													</fbt>
												}
												offset={87}
												children="🛌"
											/>
											<Emoji
												role="img"
												aria-label={
													<fbt
														project="inyo"
														desc="night onboarding aria label"
													>
														nuit
													</fbt>
												}
												offset={100}
												children="🌗"
											/>
										</EmojiTimeline>
										<Label onboarding>
											<fbt
												project="inyo"
												desc="onboarding first step days working description 1st part"
											>
												Définissez vos jours travaillés
											</fbt>
											<br />
											<fbt
												project="inyo"
												desc="onboarding first step days working description 2nd part"
											>
												(Pour vous aider à ne pas être
												débordé et ne jamais manquer une
												deadline)
											</fbt>
										</Label>
										<WeekDaysInput
											values={workingDays}
											setFieldValue={setFieldValue}
										/>
										<ActionButtons>
											<ActionButton
												theme="Primary"
												size="Medium"
												type="submit"
											>
												<fbt
													project="inyo"
													desc="confirm onboarding first step"
												>
													Continuer
												</fbt>
											</ActionButton>
											{!isFirstStep && (
												<ActionButton
													theme="Link"
													size="XSmall"
													onClick={() => {
														getPreviousStep();
													}}
												>
													{'< '}
													<fbt
														project="inyo"
														desc="back"
													>
														Retour
													</fbt>
												</ActionButton>
											)}
										</ActionButtons>
									</form>
								);
							}}
						</Formik>
					)}
				</Mutation>
			</OnboardingStep>
		);
	}
}

export default OnboardingThirdStep;
