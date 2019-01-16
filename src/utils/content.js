import styled from '@emotion/styled';
import {css, keyframes} from '@emotion/core';
import React from 'react';
import Shevy from 'shevyjs';
import {Dialog} from '@reach/dialog';
import {Link} from 'react-router-dom';

import '@reach/dialog/styles.css';
import {ReactComponent as bubbleIcon} from './icons/bubble.svg';

const shevy = new Shevy({
	baseFontSize: '17px',
});
const {
	body, content, h1, h2, h3, h4, h5, h6,
} = shevy;

// Colors
export const primaryWhite = '#ffffff';
export const primaryBlue = '#3860ff';
export const primaryNavyBlue = '#171a44';
export const primarySalmon = '#fbada1';
export const pastelGreen = '#e9fffd';
export const secondaryRed = '#e62043';
export const secondaryLightBlue = '#deebff';
export const secondaryLightYellow = '#fffae6';
export const secondaryLightGreen = '#e3fcef';
export const gray10 = '#f9f9f9';
export const gray20 = '#e0e0e0';
export const gray30 = '#cccccc';
export const gray50 = '#8c8c8c';
export const gray70 = '#666666';
export const gray80 = '#4d4d4d';
export const alpha10 = 'rgba(0, 0, 0, 0.1)';
export const signalGreen = '#0dcc94';
export const signalOrange = '#ffab00';
export const signalRed = '#fe4a49';
// Typography

export const Body = styled('div')`
	${body};
	color: ${gray80};
`;
export const H1 = styled('h1')`
	${h1};
	color: ${gray80};
	font-weight: 700;
`;
export const H2 = styled('h2')`
	${h2};
	color: ${gray80};
	font-weight: 700;
`;
export const H3 = styled('h3')`
	${h3};
	color: ${gray80};
	font-weight: 400;
`;
export const H4 = styled('h4')`
	${h4};
	color: ${gray80};
	font-weight: 400;
`;
export const H5 = styled('h5')`
	${h5};
	color: ${gray80};
	font-weight: 400;
`;
export const H6 = styled('h6')`
	${h6};
	color: ${gray80};
	font-weight: 400;
`;
export const P = styled('p')`
	${content};
	color: ${gray80};
`;
export const Ol = styled('ol')`
	${content};
	color: ${gray80};
`;
export const Ul = styled('ul')`
	${content};
	color: ${gray80};
`;
export const A = styled('a')`
	${content};
	color: ${primaryBlue};
`;

// Buttons

const buttonResetStyles = css`
	border: 1px solid transparent;
	margin: 0;
	padding: 0;
	width: auto;
	overflow: visible;
	background: transparent;
	color: inherit;
	font: inherit;
	line-height: normal;
	-webkit-font-smoothing: inherit;
	-moz-osx-font-smoothing: inherit;
	-webkit-appearance: none;
	&::-moz-focus-inner {
		border: 0;
		padding: 0;
	}
`;

const ButtonStyles = (props) => {
	switch (props.theme) {
	case 'Primary':
		return css`
				background-color: ${primaryBlue};
				color: ${primaryWhite};
				&:hover,
				&:focus {
					background-color: transparent;
					border-color: ${primaryBlue};
					color: ${primaryBlue};
				}
			`;
	case 'Link':
		return css`
				background-color: transparent;
				color: ${primaryBlue};
				text-decoration: underline;
			`;
	case 'DeleteOutline':
		return css`
				background-color: transparent;
				color: ${signalRed};
				text-decoration: underline;
			`;
	case 'Outline':
		return css`
				border-color: ${primaryBlue};
				background-color: transparent;
				color: ${primaryBlue};
				&:hover,
				&:focus {
					background-color: ${primaryBlue};
					border-color: transparent;
					color: ${primaryWhite};
				}
			`;
	case 'Disabled':
		return css`
				border-color: ${gray70};
				color: ${gray30};
				cursor: initial;
			`;
	case 'PrimaryNavy':
		return css`
				background-color: ${primaryNavyBlue};
				color: ${primaryWhite};
				&:hover,
				&:focus {
					background-color: transparent;
					border-color: ${primaryNavyBlue};
					color: ${primaryNavyBlue};
				}
			`;
	case 'Warning':
		return css`
				background-color: ${signalOrange};
				color: ${primaryNavyBlue};
				&:hover,
				&:focus {
					background-color: transparent;
					border-color: ${signalOrange};
					color: ${primaryNavyBlue};
				}
			`;
	case 'Error':
		return css`
				background-color: ${signalRed};
				color: ${primaryWhite};
				&:hover,
				&:focus {
					background-color: transparent;
					border-color: ${signalRed};
					color: ${primaryNavyBlue};
				}
			`;
	case 'Success':
		return css`
				background-color: ${signalGreen};
				color: ${primaryWhite};
				&:hover,
				&:focus {
					background-color: transparent;
					border-color: ${signalGreen};
					color: ${primaryNavyBlue};
				}
			`;
	default:
		return css`
				background-color: ${primaryWhite};
				border-color: ${gray70};
				color: ${gray70};
				&:hover,
				&:focus {
					background-color: ${gray50};
					border-color: ${gray70};
					color: ${gray10};
				}
			`;
	}
};

const ButtonSizes = (props) => {
	switch (props.size) {
	case 'Big':
		return css`
				padding: 23px 16px 24px 16px;
			`;
	case 'Medium':
		return css`
				padding: 14px 16px 15px 16px;
			`;
	case 'Small':
		return css`
				padding: 9px 16px 10px 16px;
			`;
	case 'XSmall':
		return css`
				padding: 0;
				width: inherit;
				vertical-align: inherit;
			`;
	default:
		return css`
				padding: 14px 16px 15px 16px;
			`;
	}
};

export const Button = styled('button')`
	${buttonResetStyles};
	width: auto;
	font-size: 17px;
	cursor: pointer;
	transition: background-color 0.2s ease, color 0.2s ease,
		border-color 0.2s ease;
	border-radius: 4px;
	${ButtonStyles};
	${ButtonSizes};
`;

export const LinkButton = styled(Link)`
	${buttonResetStyles} width: auto;
	font-size: 17px;
	cursor: pointer;
	transition: background-color 0.2s ease, color 0.2s ease,
		border-color 0.2s ease;
	border-radius: 4px;
	${ButtonStyles};
	${ButtonSizes};
	text-decoration: none;
`;

// Inputs

export const Input = styled('input')`
	display: block;
	border: 1px solid ${props => (props.error ? signalRed : gray70)};
	padding: 15px 18px 16px 18px;
	color: ${gray50};
	width: ${props => (props.flexible ? '100%' : 'fill-available')};
	font-family: 'Work Sans';
	font-size: 16px;
	transition: background-color 0.2s ease, color 0.2s ease,
		border-color 0.2s ease;
	&::placeholder {
		color: ${gray30};
	}
	&:disabled {
		color: ${gray30};
	}
	&:focus {
		border-color: ${primaryBlue};
	}
`;

export const Label = styled('label')`
	font-family: 'Work Sans';
	font-size: 15px;
	width: fill-available;
	color: ${gray80};
	margin-bottom: 5px;
	${props => props.required
		&& css`
			&::after {
				color: ${signalRed};
				font-size: 20px;
				transform: translateY(-6px);
				content: '*';
				padding-left: 5px;
			}
		`};
	${props => props.onboarding
		&& css`
			margin: 10px 15px 10px 16px;
			width: inherit;
		`};
`;

export const ErrorInput = styled('p')`
	font-family: 'Work Sans';
	width: fill-available;
	font-size: 12px;
	color: ${signalRed};
	text-align: right;
	margin-top: 2px;
	margin-bottom: 0;
`;
// Layout

export const FlexRow = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: ${props => props.justifyContent || 'flex-start'};
`;
export const FlexColumn = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: ${props => props.justifyContent || 'flex-start'};
	${props => props.flexGrow && `flex-grow: ${props.flexGrow};`};
	${props => props.fullHeight && 'height: 100%;'};
`;

export const ToggleButton = styled('span')`
	color: ${props => (props.active ? primaryBlue : gray80)};
	cursor: pointer;
	margin-right: 20px;
	padding-top: 15px;
	padding-bottom: 10px;
	border-bottom: 4px solid
		${props => (props.active ? primaryBlue : 'transparent')};
	transition: color 0.2s ease, border-color 0.2s ease;
`;

export function ModalContainer({size, ...props}) {
	const style = {
		width: size === 'small' ? '35vw' : '50vw',
		minWidth: '600px',
	};

	return <Dialog {...props} style={style} />;
}

export const ModalElem = styled('div')`
	position: relative;
`;

export const ModalCloseIcon = styled('div')`
	position: absolute;
	top: 0px;
	right: 0px;
	width: 40px;
	height: 40px;
	cursor: pointer;
	transition: all 0.3s ease;
	.cls-1,
	.cls-2 {
		transition: all 0.3s ease;
	}
	&:hover {
		.cls-1 {
			stroke: ${primaryNavyBlue};
		}
		.cls-2 {
			stroke: ${primaryBlue};
		}
	}
`;

export const ModalRow = styled('div')`
	padding-left: 40px;
	padding-right: 40px;
	padding-top: 5px;
	padding-bottom: 5px;
`;

const LoadingMain = styled('div')`
	font-size: 30px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
const translate = keyframes`
  0% {
    transform: translateY(0px);
  }
  25% {
	transform: translateY(5px);
  }
  50% {
	transform: translateY(0px);
  }
  75% {
	transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
`;

export const SpinningBubble = styled(bubbleIcon)`
	width: 45px;
	height: auto;
	opacity: 0.5;
	.circle {
		transform-origin: center;
		animation: ${rotate} 2s linear infinite;
		will-change: transform;
	}
	.cls-2 {
		transform-origin: center;
		animation: ${translate} 1s ease-in-out infinite;
		will-change: transform;
	}
	.dot-2 {
		animation-delay: 0.2s;
	}
	.dot-3 {
		animation-delay: 0.4s;
	}
`;

export const Loading = () => (
	<LoadingMain>
		<SpinningBubble />
	</LoadingMain>
);
