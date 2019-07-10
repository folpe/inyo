import styled from '@emotion/styled';
import * as Sentry from '@sentry/browser';
import {Formik} from 'formik';
import debounce from 'lodash.debounce';
import React from 'react';
import {useMutation} from 'react-apollo-hooks';
import ReactGA from 'react-ga';
import * as Yup from 'yup';

import {BREAKPOINTS} from '../../utils/constants';
import {ErrorInput, gray20} from '../../utils/content';
import userIllus from '../../utils/images/bermuda-coming-soon.svg';
import {CHECK_UNIQUE_EMAIL, UPDATE_USER} from '../../utils/mutations';
import {Button, primaryWhite} from '../../utils/new/design-system';
import {GET_USER_INFOS} from '../../utils/queries';
import FormElem from '../FormElem';

const UserDataFormMain = styled('div')``;

const FormContainer = styled('div')`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-column-gap: 20px;
	flex: 1;
	align-items: center;

	@media (max-width: ${BREAKPOINTS}px) {
		display: flex;
		flex-direction: column;
	}
`;

const ProfileSection = styled('div')`
	background: ${primaryWhite};
	padding: 60px 40px;
	border: 1px solid ${gray20};
	display: flex;
	flex-direction: row;

	@media (max-width: ${BREAKPOINTS}px) {
		padding: 0;
		border: none;
	}
`;
const UpdateButton = styled(Button)`
	display: block;
	margin-top: 15px;
	margin-left: auto;
	margin-right: 50px;
	margin-bottom: 80px;

	@media (max-width: ${BREAKPOINTS}px) {
		margin-right: 0;
	}
`;

const Illus = styled('img')`
	margin-right: 2rem;
	align-self: end;
	grid-row: 1 / 3;
`;

const UserDataForm = ({done, ...componentProps}) => {
	const {firstName, lastName, email} = componentProps.data;
	const [updateUser] = useMutation(UPDATE_USER);
	const [checkEmailAvailability] = useMutation(CHECK_UNIQUE_EMAIL);

	const debouncedCheckEmail = debounce(checkEmailAvailability, 300);

	return (
		<UserDataFormMain>
			<Formik
				initialValues={{
					firstName,
					lastName,
					email,
				}}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email('Email invalide')
						.required('Requis')
						.test(
							'unique-email',
							"L'email est déjà utilisé",
							value => email === value
								|| debouncedCheckEmail({
									variables: {
										email: value,
									},
								}).then(({data}) => data.isAvailable),
						),
					firstName: Yup.string().required('Requis'),
					lastName: Yup.string().required('Requis'),
				})}
				onSubmit={async (values, actions) => {
					actions.setSubmitting(false);
					try {
						updateUser({
							variables: {
								firstName: values.firstName,
								lastName: values.lastName,
								email: values.email,
							},
							update: (
								cache,
								{data: {updateUser: updatedUser}},
							) => {
								window.Intercom(
									'trackEvent',
									'updated-user-data',
								);
								const data = cache.readQuery({
									query: GET_USER_INFOS,
								});

								data.me = {
									...data.me,
									...updatedUser,
								};

								cache.writeQuery({
									query: GET_USER_INFOS,
									data,
								});
								ReactGA.event({
									category: 'User',
									action: 'Updated user data',
								});
								done();
							},
						});
					}
					catch (error) {
						if (
							error.networkError
							&& error.networkError.result
							&& error.networkError.result.errors
						) {
							Sentry.captureException(
								error.networkError.result.errors,
							);
						}
						else {
							Sentry.captureException(error);
						}
						actions.setSubmitting(false);
						actions.setErrors(error);
						actions.setStatus({
							msg: "Quelque chose s'est mal passé",
						});
					}
				}}
			>
				{(props) => {
					const {status, handleSubmit} = props;

					return (
						<form onSubmit={handleSubmit}>
							<ProfileSection>
								<FormContainer>
									<Illus src={userIllus} />
									<FormElem
										{...props}
										name="firstName"
										type="text"
										label="Prénom"
										placeholder="Jacques"
										padded
										required
									/>
									<FormElem
										{...props}
										name="lastName"
										type="text"
										label="Nom"
										placeholder="Bertrand"
										padded
										required
									/>
									<FormElem
										{...props}
										name="email"
										type="email"
										label="Email"
										placeholder="jacques@bertrandsa.com"
										padded
										required
										style={{
											gridColumn: '2 / 4',
										}}
									/>
								</FormContainer>
								{status && status.msg && (
									<ErrorInput style={{marginBottom: '1rem'}}>
										{status.msg}
									</ErrorInput>
								)}
							</ProfileSection>
							<UpdateButton type="submit" big>
								Mettre à jour
							</UpdateButton>
						</form>
					);
				}}
			</Formik>
		</UserDataFormMain>
	);
};

export default UserDataForm;
