import React, {useState, useEffect, useRef} from 'react';
import styled from '@emotion/styled';
import useOnClickOutside from 'use-onclickoutside';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {
	primaryPurple,
	primaryWhite,
	Button,
} from '../../utils/new/design-system';

const UnitInputContainer = styled('div')`
	display: flex;
`;

const UnitInputInput = styled('input')`
	padding: 0 2rem;
	width: 30px;
	margin-right: calc(-1.2rem - 10px);
	background-color: #f5f2fe;
	border-radius: 20px;
	height: 27px;
	border: 1px solid transparent;
	font-weight: 600;
	color: ${primaryPurple};
`;

const UnitInputSwitch = styled('label')`
	position: relative;
	display: inline-block;
	width: 100px;
	height: 29px;
	cursor: pointer;
`;

const UnitInputLabel = styled('span')`
	position: absolute;
	top: 20%;
	color: ${primaryPurple};
	right: 1rem;
	z-index: 1;

	&:first-child {
		left: 1rem;
	}
`;

const UnitInputSlider = styled('span')`
	position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: -2px;
    bottom: 0;
    background-color: ${primaryWhite};
    transition: transform ease .4s;
    border-radius: 29px;
    border: 2px solid #DDD;

	&::before {
		position: absolute;
		content: '${props => (props.isHours ? 'heures' : 'Jours')}';
		transform: ${props => (props.isHours ? 'translateX(29px)' : 'translateX(0px)')};
		font-family: 'Work Sans', sans-serif;
		font-size: 12px;
		line-height: 21px;
		height: 21px;
		width: auto;
		left: 2px;
		bottom: 2px;
		background-color: #5020ee;
		color: #FFF;
		transition: .4s;
		border-radius: 16px;
		padding: 0 .8rem;
		z-index: 2;
	}
`;

const UnitInputForm = styled('form')`
	display: flex;
	flex-flow: row nowrap;
`;

export default function ({
	unit,
	onBlur,
	onSubmit,
	innerRef,
	withButton,
	cancel,
}) {
	const [isHours, setIsHours] = useState(false);
	const inputRef = innerRef || useRef();
	const containerRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();
	});

	useOnClickOutside(containerRef, () => {
		onBlur();
	});

	return (
		<Formik
			initialValues={{
				unit,
			}}
			validationSchema={Yup.object().shape({
				unit: Yup.number().required(),
			})}
			onSubmit={(values, actions) => {
				actions.setSubmitting(false);
				try {
					const valueFloat = parseFloat(values.unit);

					onSubmit(isHours ? valueFloat / 8 : valueFloat);
				}
				catch (error) {
					actions.setSubmitting(false);
					actions.setErrors(error);
				}
			}}
		>
			{({handleSubmit, values, setFieldValue}) => (
				<UnitInputForm onSubmit={handleSubmit}>
					<UnitInputContainer ref={containerRef}>
						<UnitInputInput
							id="unit"
							value={values.unit}
							name="unit"
							type="number"
							ref={inputRef}
							onChange={e => setFieldValue('unit', e.target.value)
							}
						/>
						<UnitInputSwitch
							onClick={() => {
								if (isHours) {
									setFieldValue('unit', values.unit / 8);
								}
								else {
									setFieldValue('unit', values.unit * 8);
								}
								setIsHours(!isHours);
							}}
						>
							<UnitInputLabel>J</UnitInputLabel>
							<UnitInputLabel>h</UnitInputLabel>
							<UnitInputSlider isHours={isHours} />
						</UnitInputSwitch>
					</UnitInputContainer>
					{withButton && (
						<>
							<Button textIcon tiny type="submit">
								✓
							</Button>
						</>
					)}
				</UnitInputForm>
			)}
		</Formik>
	);
}
