import React, {useState} from 'react';
import {Formik} from 'formik';
import {useMutation, useApolloClient, useQuery} from 'react-apollo-hooks';
import {withRouter} from 'react-router-dom';
import styled from '@emotion/styled';
import * as Yup from 'yup';

import CreateProjectModalForm from '../CreateProjectModalForm';
import CustomerModalAndMail from '../CustomerModalAndMail';
import CreateProjectModalViewContent from '../CreateProjectModalViewContent';

import {GET_PROJECT_DATA, GET_ALL_PROJECTS} from '../../utils/queries';
import {CREATE_PROJECT} from '../../utils/mutations';
import {templates} from '../../utils/project-templates';
import {ModalContainer, ModalElem} from '../../utils/content';

function CreateProjectModal({onDismiss, history}) {
	const [viewContent, setViewContent] = useState(false);
	const [createCustomer, setCreateCustomer] = useState(false);
	const [addCustomer, setAddCustomer] = useState(false);
	const [addDeadline, setAddDeadline] = useState(false);
	const createProject = useMutation(CREATE_PROJECT);
	const client = useApolloClient();

	const {loading: loadingProjects, data: dataProjects} = useQuery(
		GET_ALL_PROJECTS,
		{suspend: true},
	);

	let optionsProjects = [];

	if (!loadingProjects) {
		optionsProjects = dataProjects.me.projects
			.filter(project => project.status !== 'REMOVED')
			.map(project => ({
				value: project.id,
				label: project.name,
			}));
	}

	return (
		<Formik
			initialValues={{
				source: 'BLANK',
			}}
			validate={(values) => {
				try {
					Yup.object({
						name: Yup.string().required('Requis'),
					}).validateSync(values, {abortEarly: false});

					return {};
				}
				catch (err) {
					return err.inner.reduce((errors, errorContent) => {
						errors[errorContent.path] = errorContent.message;
						return errors;
					}, {});
				}
			}}
			onSubmit={async (
				{
					modelTemplate,
					modelProject,
					customerId,
					deadline,
					name,
					source,
				},
				actions,
			) => {
				actions.setSubmitting(true);

				let sections;

				if (modelTemplate && source === 'MODELS') {
					const sourceTemplate = templates.find(
						tplt => tplt.name === modelTemplate,
					);

					sections = sourceTemplate.sections;
				}
				else if (modelProject && source === 'PROJECTS') {
					const {
						data: {project: sourceProject},
					} = await client.query({
						query: GET_PROJECT_DATA,
						variables: {
							projectId: modelProject,
						},
					});

					sections = sourceProject.sections.map(section => ({
						name: section.name,
						items: section.items.map(
							({
								name: itemName,
								unit,
								description,
								type,
								timeItTook,
							}) => ({
								name: itemName,
								unit: timeItTook || unit || 0,
								description,
								type,
							}),
						),
					}));
				}

				const {data} = await createProject({
					variables: {
						name,
						sections,
						customerId,
						deadline,
					},
				});

				history.push(`/app/tasks?projectId=${data.createProject.id}`);
				actions.setSubmitting(false);
			}}
		>
			{props => (
				<>
					{!createCustomer && !viewContent && (
						<form onSubmit={props.handleSubmit}>
							<ModalContainer onDismiss={onDismiss}>
								<ModalElem>
									<CreateProjectModalForm
										{...props}
										setViewContent={setViewContent}
										setCreateCustomer={setCreateCustomer}
										onDismiss={onDismiss}
										addDeadline={addDeadline}
										addCustomer={addCustomer}
										setAddDeadline={setAddDeadline}
										setAddCustomer={setAddCustomer}
										optionsProjects={optionsProjects}
									/>
								</ModalElem>
							</ModalContainer>
						</form>
					)}
					{viewContent && (
						<form onSubmit={props.handleSubmit}>
							<ModalContainer onDismiss={onDismiss}>
								<ModalElem>
									<CreateProjectModalViewContent
										optionsProjects={optionsProjects}
										back={() => setViewContent(false)}
										{...props}
									/>
								</ModalElem>
							</ModalContainer>
						</form>
					)}
					{createCustomer && (
						<CustomerModalAndMail
							noSelect
							withBack
							onDismiss={() => {
								setCreateCustomer(false);
							}}
							onValidate={({id}) => {
								props.setFieldValue('customerId', id);
							}}
						/>
					)}
				</>
			)}
		</Formik>
	);
}

export default withRouter(CreateProjectModal);
