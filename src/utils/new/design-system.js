import React from 'react';
import ReactSelect from 'react-select';
import styled from '@emotion/styled/macro';
import {css} from '@emotion/core';
import Shevy from 'shevyjs';
import {Link} from 'react-router-dom';
import {gray30} from '../content';
import {BREAKPOINTS} from '../constants';
import Pencil from '../icons/pencil.svg';

export const primaryPurple = '#5020ee';
export const mediumPurple = '#8f76e0';
export const lightPurple = '#f8f8ff';
export const primaryWhite = '#fff';
export const primaryRed = '#ff3366';
export const lightRed = '#fff2f5';
export const primaryGrey = '#A9A9A9';
export const accentGrey = '#c7c7c7';
export const lightGrey = '#fafafa';
export const mediumGrey = '#eee';
export const primaryBlack = '#140642';

const shevy = new Shevy({
	baseFontSize: '14px',
});

const {body} = shevy;

export const Body = styled('div')`
	${body};
`;

const getButtonHoveredColor = (props) => {
	if (props.white || props.link) {
		return primaryPurple;
	}
	return primaryWhite;
};

const getButtonHoveredBackground = (props) => {
	if (props.red) {
		return primaryRed;
	}
	if (props.white) {
		return primaryWhite;
	}
	return primaryPurple;
};

const getButtonHoveredBorderColor = (props) => {
	if (props.primary) {
		return 'transparent';
	}
	if (props.red) {
		return primaryRed;
	}
	if (props.white) {
		return primaryWhite;
	}
	return primaryPurple;
};

export const Button = styled('button')`
	font-size: 13px;
	font-family: 'Work Sans', sans-serif;
	padding: 0.3rem 0.8rem;
	font-weight: ${(props) => {
		if (props.white) {
			return '500';
		}
		return '400';
	}};
	letter-spacing: ${(props) => {
		if (props.white) {
			return '0.01rem';
		}
		return 0;
	}};
	border: ${(props) => {
		if (props.white) {
			return '2px solid #333';
		}
		return '1px solid #333';
	}};
	border-radius: 30px;
	cursor: pointer;
	text-decoration: none;
	background: ${(props) => {
		if (props.primary) {
			return primaryPurple;
		}
		if (props.white || props.grey) {
			return 'transparent';
		}
		return primaryWhite;
	}};
	color: ${(props) => {
		if (props.link && props.disabled) {
			return primaryGrey;
		}
		if (props.primary) {
			return primaryWhite;
		}
		if (props.red) {
			return primaryRed;
		}
		if (props.grey) {
			return primaryGrey;
		}
		if (props.white) {
			return primaryWhite;
		}
		return primaryPurple;
	}};

	svg {
		fill: ${(props) => {
		if (props.link && props.disabled) {
			return primaryGrey;
		}
		if (props.primary) {
			return primaryWhite;
		}
		if (props.red) {
			return primaryRed;
		}
		if (props.grey) {
			return primaryGrey;
		}
		if (props.white) {
			return primaryWhite;
		}
		return primaryPurple;
	}};
	}

	border-color: currentColor;
	display: flex;
  align-items: center;

	${props => !props.disabled
		&& css`
			&:hover {
				svg {
					fill: ${getButtonHoveredColor(props)};
				}
				background: ${getButtonHoveredBackground(props)};
				color: ${getButtonHoveredColor(props)};
				border-color: ${getButtonHoveredBorderColor(props)};

				&::before {
					color: currentColor;
				}
			}
		`}

	${props => props.textIcon
		&& `
		font-weight: 500;
	`}

	${props => props.big
		&& `
		font-size: 14px;
		font-weight: 500;
		padding: .8rem 1.6rem;
	`}

	${props => props.icon
		&& `&::before {
			content: '${props.icon}';
			margin-right: .4rem;
			color: currentColor;
			font-weight: 500;
		}`};

	${props => props.tiny
		&& `
		padding: 0;
		width: 30px;
		height: 30px;
	`}

	${props => props.link
		&& `
			padding: 0;
			margin: 0;
			border: none;
			background: none;

			:hover {
				border: none;
				background: none;
			}

			@media (max-width: ${BREAKPOINTS}px) {
				width: auto !important;
				padding: 0 !important;
			}
		`}

	${props => props.centered
		&& `
		margin: 0 auto;
	`}


	& + button {
		margin-left: .5rem;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		width: 100%;
		padding: 0.6rem 0.8rem;
		display: initial;
	}
`;

export const ButtonLink = Button.withComponent(Link);

export const ProjectHeading = styled('div')`
	color: ${accentGrey};
	font-size: 32px;
`;

export const Heading = styled('h1')`
	font-weight: 500;
	color: ${primaryPurple};
	font-size: 32px;
	margin-top: 0;

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 24px;
	}
`;

export const TaskHeading = styled('h2')`
	color: ${primaryGrey};
	font-size: 18px;
	line-height: 1.5;
	font-weight: 400;
	flex: 1 0
		${props => (props.small ? 'calc(100% - 458px)' : 'calc(100% - 168px)')};

	@media (max-width: ${BREAKPOINTS}px) {
		font-size: 14px;
		margin: 0;
	}
`;

export const SubHeading = styled('div')`
	text-transform: uppercase;
	font-size: 12px;
	letter-spacing: 0.5px;
	color: ${primaryBlack};
	font-weight: 500;
`;

export const P = styled('p')`
	font-size: 14px;
	line-height: 1.6em;
	color: ${primaryBlack};
`;

export const HR = styled('hr')`
	margin: 2rem 0;
	border: 0;
	border-top: 1px solid ${mediumGrey};
`;

export const Label = styled('label')`
	font-size: 14px;
	color: ${primaryGrey};
`;

export const A = styled('a')`
	font-size: 1em;
	color: ${primaryPurple};
	text-decoration: none;
	border-bottom: 2px solid transparent;

	&:hover {
		border-color: ${primaryPurple};
		transition: border-color 200ms ease;
	}
`;

export const CommentIcon = styled('div')`
	display: flex;
	position: relative;
	width: 20px;
	height: 14px;
	margin-top: -1px;
	margin-right: 0.3rem;
	font-weight: 600;
	background-color: ${props => (props.new ? primaryPurple : mediumGrey)};
	color: ${(props) => {
		if (props.new) {
			return primaryWhite;
		}
		if (props.old) {
			return primaryBlack;
		}
		return primaryPurple;
	}};
	font-size: 12px;
	text-align: center;
	cursor: pointer;
	justify-content: center;
	align-items: center;

	&:hover {
		background: ${primaryPurple};
		color: ${primaryWhite};

		&::after {
			border-color: ${primaryPurple} transparent transparent transparent;
		}
	}

	&::after {
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		left: calc(50% - 4px);
		top: 100%;
		border-style: solid;
		border-width: 4px 4px 0 4px;
		border-color: ${props => (props.new ? primaryPurple : mediumGrey)}
			transparent transparent transparent;
	}
`;

const TaskInfosContent = styled('div')`
	color: ${primaryGrey};
	padding-bottom: 0;
	display: flex;
	border-bottom: solid 1px transparent;
`;

export const TaskInfosItem = styled('div')`
	display: flex;
	margin-right: 1rem;
	font-size: 12px;
	${props => props.onClick && 'cursor: pointer;'}
	align-items: center;
	height: 30px;
	text-decoration: none;

	&:hover {
		text-decoration: none;
	}

	${props => (props.inactive
		? ''
		: `&:hover ${TaskInfosContent} {
			color: ${primaryPurple};
			border-bottom: 1px dotted ${primaryPurple};
		}`)}
`;

export const TaskInfosItemLink = TaskInfosItem.withComponent(Link);

export function TaskIconText({icon, content, ...rest}) {
	return (
		<TaskInfosItem {...rest}>
			{icon}
			<TaskInfosContent>{content}</TaskInfosContent>
		</TaskInfosItem>
	);
}

export const LayoutMainElem = styled('div')`
	flex: 1;
`;

export const Input = styled('input')`
	font-family: 'Work Sans', sans-serif;
	font-size: inherit;

	background-color: ${props => (props.error ? lightRed : lightPurple)};
	border-radius: ${props => (props.big ? '24px' : '20px')};
	height: ${props => (props.big ? '48px' : '27px')};
	padding: 0 1rem;
	width: auto;
	border: 1px solid ${props => (props.error ? primaryRed : 'transparent')};
	font-weight: 400;
	color: ${props => (props.error ? primaryRed : primaryPurple)};

	&::placeholder {
		font-weight: normal;
		color: ${props => (props.error ? primaryRed : mediumPurple)};
		font-style: italic;
		font-size: 14px;
	}

	&:disabled {
		background: #f3f3f3;
		color: #7b7980;
	}

	&:focus {
		outline: none;
		box-shadow: none;
		background: #fff;
		border: 1px solid #f5f2fe;
		transition: all 400ms ease;
		color: ${primaryPurple};

		&::placeholder {
			color: ${mediumPurple};
			font-style: italic;
			font-size: 14px;
		}
	}
`;

export const InputLabel = styled('div')`
	${Label} {
		font-size: 12px;
		margin-bottom: 0.8rem;
		margin-left: 1rem;

		${props => props.required
			&& css`
				&::after {
					color: ${primaryRed};
					content: '*';
					padding-left: 5px;
				}
			`};
	}
`;

export const TaskInputDropdown = styled('div')`
	background: white;
	border: 1px solid ${mediumGrey};
	box-shadow: 5px 5px 15px ${primaryGrey};
	position: absolute;
	z-index: 2; /* do a portal instead */
	width: 500px;
	top: calc(100% + 15px);
	left: 55px;

	@media (max-width: ${BREAKPOINTS}px) {
		left: -1rem;
		width: calc(100% + 2rem);
		box-shadow: 0 0 20rem ${primaryBlack};
	}
`;

export const TaskInputDropdownHeader = styled('p')`
	text-transform: uppercase;
	color: ${gray30};
	margin: 1.5em 2em 0.5em 2em;
`;

export const DueDateInputElem = styled('input')`
	font-family: 'Work sans', sans-serif;
	font-size: inherit;
	color: ${primaryPurple};
	width: 83px;
	display: block;
`;

export const DateInputContainer = styled('div')`
	position: relative;
	display: inline-block;
`;

export const FilterInput = styled(Input)`
	margin: 3rem 0;
	padding: 0.25rem 1rem;
	padding-left: 3rem;
	border-radius: 1.5rem;
	width: 50%;

	background-position: 1rem center;
	background-repeat: no-repeat;
	background-image: url(${props => props.icon});

	&:focus {
		background-position: calc(1rem + 1px) center;
		background-repeat: no-repeat;
		background-image: url(${props => props.icon});
	}

	@media (max-width: ${BREAKPOINTS}px) {
		margin: 0.5rem 0;
		width: calc(100% - 4rem);
	}
`;

export const Help = styled('div')`
	position: fixed;
	bottom: 3rem;
	left: 3rem;
	width: 1.5rem;
	height: 1.5rem;
	border: 2px solid transparent;
	border-radius: 50%;
	background-color: ${mediumGrey};
	color: ${primaryBlack};
	line-height: 0;
	font-weight: 500;
	display: ${props => (props.customerToken ? 'flex' : 'none')};
	align-items: center;
	justify-content: center;
	cursor: pointer;

	transition: all 300ms ease;

	&:hover {
		border-color: ${primaryPurple};
		color: ${primaryPurple};
		background-color: transparent;
	}

	@media (max-width: ${BREAKPOINTS}px) {
		display: none;
	}
`;

export const Aside = styled('aside')`
	flex-direction: column;
	align-items: stretch;
	flex: 0 0 270px;
	padding-right: 4rem;

	@media (max-width: ${BREAKPOINTS}px) {
		padding-right: 0;
		margin-top: 2rem;
		width: 100%;
	}
`;

export const Main = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	flex: 1;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column-reverse;
	}
`;

export const Container = styled('div')`
	display: flex;
	width: 100%;
	max-width: 1280px;
	margin: 0 auto;

	@media (max-width: ${BREAKPOINTS}px) {
		flex-direction: column;
	}
`;

export const Content = styled('div')`
	display: flex;
	flex-direction: column;
	flex: 1;
	${props => (props.small ? 'width: 100%' : '')};
	${props => (props.small ? 'max-width: 640px' : '')};
	${props => (props.small ? 'margin: 0 auto' : '')};
`;

export const UL = styled('ul')`
	${props => (props.noBullet ? 'padding: 0' : '')};
	${props => (props.noBullet ? 'list-style-type: none' : '')};
`;

export const IllusContainer = styled('div')`
	height: 660px;
	background: url('${props => props.bg}');
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
	display: flex;
`;

export const IllusFigureContainer = styled('div')`
	height: ${props => (props.big ? '70%' : '60%')};
	flex: 1;
	background: url('${props => props.fig}');
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
`;

export const IllusText = styled('div')`
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	padding-right: 70px;
	padding-bottom: 120px;

	${P} {
		font-size: 1.15rem;
	}
`;

export const IllusTextIcon = styled('span')`
	position: relative;
	width: 20px;
	height: 20px;
	display: inline-block;
	font-size: 1rem;
	z-index: 0;
	text-align: center;
	cursor: pointer;

	&:after {
		content: '';
		width: 20px;
		height: 20px;
		position: absolute;
		top: 5px;
		left: 0px;
		background: ${accentGrey};
		border-radius: 50%;
		z-index: -1;
		display: inline-block;
	}

	&:hover {
		color: ${primaryWhite};

		&:after {
			background: ${primaryPurple};
		}
	}
`;

export const UserSpan = styled('span')`
	color: ${primaryPurple};
`;

export const CustomerSpan = styled('span')`
	color: ${primaryRed};
`;

const customSelectStyles = props => ({
	dropdownIndicator: (styles, {isDisabled}) => ({
		...styles,
		color: isDisabled ? primaryGrey : primaryPurple,
		paddingTop: 0,
		paddingBottom: 0,
	}),
	clearIndicator: styles => ({
		...styles,
		color: primaryPurple,
		paddingTop: 0,
		paddingBottom: 0,
	}),
	placeholder: (styles, {isDisabled}) => ({
		...styles,
		color: isDisabled ? lightGrey : lightPurple,
		fontStyle: 'italic',
		fontSize: '14px',
	}),
	singleValue: (styles, {isDisabled}) => ({
		...styles,
		color: isDisabled ? primaryGrey : primaryPurple,
	}),
	input: (styles, {isDisabled}) => ({
		...styles,
		padding: 0,
		color: isDisabled ? primaryGrey : primaryPurple,
	}),
	control: (styles, {isDisabled, big}) => ({
		...styles,
		height: props.big && '40px',
		minHeight: 'auto',
		border: 'none',
		backgroundColor: isDisabled ? lightGrey : lightPurple,
		borderRadius: '20px',
		':hover, :focus, :active': {
			border: 'none',
		},
	}),
	indicatorSeparator: () => ({
		backgroundColor: 'transparent',
	}),
});

export const Select = ({style, ...rest}) => (
	<ReactSelect
		styles={{...customSelectStyles(rest), ...style}}
		noOptionsMessage={() => 'Aucune option'}
		{...rest}
	/>
);

export const DateContainer = styled('div')`
	position: relative;
	z-index: 1;

	p:hover {
		position: relative;
		cursor: pointer;

		&:before {
			content: '';
			display: block;
			background: ${lightGrey};
			position: absolute;
			left: -0.5rem;
			top: -0.5rem;
			right: -0.5rem;
			bottom: -0.5rem;
			border-radius: 8px;
			z-index: -1;
		}
		&:after {
			content: '';
			display: block;
			background-color: ${accentGrey};
			mask-size: 35%;
			mask-position: center;
			mask-repeat: no-repeat;
			mask-image: url(${Pencil});
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			width: 50px;
		}
	}
`;

export const BigNumber = styled(P)`
	font-size: 20px;
	font-weight: 500;
	color: ${props => (props.urgent ? primaryRed : primaryGrey)};
`;

export const BackButton = styled(Button)`
	align-self: flex-start;
	text-transform: uppercase;
	margin: 1rem 0;
	${props => props.withMargin && 'margin-bottom: 1rem;'}

	::before {
		content: '⇽';
		margin-right: 10px;
	}
`;
