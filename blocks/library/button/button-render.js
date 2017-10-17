export default ( { align,
	buttonBackgroundColor,
	buttonText,
	buttonTextColor,
	buttonUrl,
	title,
 } ) => {
	return (
		<div className={ `wp-block-button align${ align }` } style={ { backgroundColor: buttonBackgroundColor } }>
			<a href={ buttonUrl } title={ title } style={ { color: buttonTextColor } }>
				{ buttonText }
			</a>
		</div>
	);
};

