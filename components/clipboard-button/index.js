/**
 * External dependencies
 */
import Clipboard from 'clipboard';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Button } from '../';

class ClipboardButton extends Component {
	constructor() {
		super( ...arguments );

		this.bindContainer = this.bindContainer.bind( this );
		this.stopPropagation = this.stopPropagation.bind( this );
		this.onCopy = this.onCopy.bind( this );
		this.getText = this.getText.bind( this );
	}

	componentDidMount() {
		const { container, getText, onCopy } = this;
		const button = container.firstChild;

		this.clipboard = new Clipboard( button,	{
			text: getText,
			container,
		} );

		this.clipboard.on( 'success', onCopy );
	}

	componentWillUnmount() {
		this.clipboard.destroy();
		delete this.clipboard;
	}

	bindContainer( container ) {
		this.container = container;
	}

	stopPropagation( event ) {
		// Since Clipboard will create a fake textarea for copying then destroy
		// it afterward, prevent the removal's blur event from being handled.
		event.stopPropagation();
	}

	onCopy() {
		const { onCopy } = this.props;
		if ( onCopy ) {
			onCopy();
		}
	}

	getText() {
		return this.props.text;
	}

	render() {
		const { className, children } = this.props;
		const classes = classnames( 'components-clipboard-button', className );

		return (
			<div onBlur={ this.stopPropagation } ref={ this.bindContainer }>
				<Button className={ classes }>
					{ children }
				</Button>
			</div>
		);
	}
}

export default ClipboardButton;
