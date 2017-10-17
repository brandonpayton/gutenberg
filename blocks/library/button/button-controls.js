/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { IconButton, PanelBody } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Editable from '../../editable';
import UrlInput from '../../url-input';
import ColorPalette from '../../color-palette';
import InspectorControls from '../../inspector-controls';

export default ( { buttonBackgroundColor,
					buttonText,
					buttonTextColor,
					buttonUrl,
					className,
					focus,
					setButtonBackgroundColor,
					setButtonText,
					setButtonTextColor,
					setButtonUrl,
					setFocus,
					showInspector,
					title,
					} ) => {
	return ( <span key="button" className={ className } title={ title } style={ { backgroundColor: buttonBackgroundColor } } >
		<Editable
			tagName="span"
			placeholder={ __( 'Add text…' ) }
			value={ buttonText }
			focus={ focus }
			onFocus={ setFocus }
			onChange={ setButtonText }
			formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
			style={ {
				color: buttonTextColor,
			} }
			keepPlaceholderOnFocus
        />
		{ focus &&
		<form
			className="blocks-format-toolbar__link-modal"
			onSubmit={ ( event ) => event.preventDefault() }>
			<UrlInput
				value={ buttonUrl }
				onChange={ setButtonUrl }
                />
			<IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
		</form>
        }
		{ showInspector &&
		<InspectorControls key="inspector">
			<PanelBody title={ __( 'Button Background Color' ) }>
				<ColorPalette
					value={ buttonBackgroundColor }
					onChange={ setButtonBackgroundColor }
                    />
			</PanelBody>
			<PanelBody title={ __( 'Button Text Color' ) }>
				<ColorPalette
					value={ buttonTextColor }
					onChange={ setButtonTextColor }
                    />
			</PanelBody>
		</InspectorControls>
        }
	</span> );
};

