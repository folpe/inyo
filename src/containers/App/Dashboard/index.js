import React, {Component} from 'react';
import {Query} from 'react-apollo';
import styled from 'react-emotion';
import {ToastContainer, toast} from 'react-toastify';

import Tasks from './tasks';
import TopBar, {
	TopBarTitle,
	TopBarButton,
	TopBarNavigation,
} from '../../../components/TopBar';
import {
	H2, primaryBlue, gray10, Loading,
} from '../../../utils/content';
import {GET_USER_INFOS} from '../../../utils/queries';
import {ReactComponent as FoldersIcon} from '../../../utils/icons/folders.svg';
// import {ReactComponent as UsersIcon} from '../../../utils/icons/users.svg';
import {ReactComponent as SettingsIcon} from '../../../utils/icons/settings.svg';
import 'react-toastify/dist/ReactToastify.css';

const Main = styled('div')`
	background: ${gray10};
	min-height: 100vh;
	padding-bottom: 80px;
`;
const Content = styled('div')`
	padding-left: 40px;
	padding-right: 40px;
`;

const WelcomeMessage = styled(H2)`
	color: ${primaryBlue};
`;

class Dashboard extends Component {
	toast = () => {
		toast.info(
			<div>
				<p>Les données ont été mises à jour</p>
			</div>,
			{
				position: toast.POSITION.BOTTOM_LEFT,
				autoClose: 3000,
			},
		);
	};

	render() {
		return (
			<Query query={GET_USER_INFOS}>
				{({client, loading, data}) => {
					if (loading) return <Loading />;

					const {me} = data;
					const {firstName} = me;

					return (
						<Main>
							<ToastContainer />
							<TopBar>
								<TopBarTitle>Tableau de bord</TopBarTitle>
								<TopBarNavigation>
									<TopBarButton
										theme="Primary"
										size="Medium"
										onClick={() => {
											this.props.history.push(
												'/app/projects/create',
											);
										}}
									>
										Créer un nouveau projet
									</TopBarButton>
									<TopBarButton
										theme="Link"
										size="XSmall"
										onClick={() => {
											this.props.history.push(
												'/app/projects',
											);
										}}
									>
										<FoldersIcon />
									</TopBarButton>
									{/* <TopBarButton
										theme="Link"
										size="XSmall"
										onClick={() => {
											this.props.history.push(
												'/app/customers',
											);
										}}
									>
										<UsersIcon />
									</TopBarButton> */}
									<TopBarButton
										theme="Link"
										size="XSmall"
										onClick={() => {
											this.props.history.push(
												'/app/account',
											);
										}}
									>
										<SettingsIcon />
									</TopBarButton>
								</TopBarNavigation>
							</TopBar>
							<Content>
								<WelcomeMessage>
									Bonjour {firstName} !
								</WelcomeMessage>

								<Tasks />
							</Content>
						</Main>
					);
				}}
			</Query>
		);
	}
}

export default Dashboard;
