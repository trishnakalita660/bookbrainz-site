import * as bootstrap from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import request from 'superagent';


const {Alert, Button, Modal} = bootstrap;

class DeleteOrRemoveCollaborationModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit() {
		request.post(this.postUrl)
			.send()
			.then((res) => {
				if (this.props.delete) {
					window.location.href = `/editor/${this.props.collection.ownerId}/collections`;
				}
				else {
					window.location.href = `/editor/${this.props.collaboratorId}/collections`;
				}
			}, (error) => {
				this.setState({
					error: 'Something went wrong! Please try again later'
				});
			});
	}

	render() {
		const {collection} = this.props;
		// eslint-disable-next-line one-var
		let modalBody, modalTitle, submitButton;
		if (this.props.delete) {
			this.postUrl = `/collection/${collection.id}/delete/handler`;
			modalTitle = 'Confirm deletion';
			modalBody = (
				<Alert bsStyle="warning">
					<h4>
						<FontAwesomeIcon icon="exclamation-triangle"/>&nbsp;
						You’re about to delete the Collection: {collection.name}.
					</h4>
					<p>
						Make sure you actually want to delete this Collection <br/>
						There is no way to undo this.
					</p>
				</Alert>
			);
			submitButton = (
				<Button bsStyle="danger" onClick={this.handleSubmit}>
					<FontAwesomeIcon icon="trash-alt"/> Delete
				</Button>
			);
		}
		else {
			this.postUrl = `/collection/${collection.id}/collaborator/remove/${this.props.collaboratorId}`;
			modalTitle = 'Remove collaboration';
			modalBody = (
				<Alert bsStyle="warning">
					<h4>
						<FontAwesomeIcon icon="exclamation-triangle"/>&nbsp;
						You’re about to remove yourself as a collaborator of Collection: {collection.name}.
					</h4>
					<p>
						Are you sure you want to do this ? You wont’t be able to undo this.
					</p>
				</Alert>
			);
			submitButton = (
				<Button bsStyle="warning" onClick={this.handleSubmit}>
					<FontAwesomeIcon icon="times-circle"/> Remove collaboration
				</Button>
			);
		}

		let errorComponent = null;
		if (this.state.error) {
			errorComponent =
				<Alert bsStyle="danger">{this.state.error}</Alert>;
		}

		return (
			<Modal
				show={this.props.show}
				onHide={this.props.onCloseModal}
			>
				<Modal.Header closeButton>
					<Modal.Title>{modalTitle}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{modalBody}
					{errorComponent}
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle="info" onClick={this.props.onCloseModal}>
						Cancel
					</Button>
					{submitButton}
				</Modal.Footer>
			</Modal>
		);
	}
}


DeleteOrRemoveCollaborationModal.displayName = 'DeleteOrRemoveCollaborationModal';
DeleteOrRemoveCollaborationModal.propTypes = {
	collaboratorId: PropTypes.number,
	collection: PropTypes.object.isRequired,
	delete: PropTypes.bool,
	onCloseModal: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired
};
DeleteOrRemoveCollaborationModal.defaultProps = {
	collaboratorId: -1,
	delete: true
};

export default DeleteOrRemoveCollaborationModal;
