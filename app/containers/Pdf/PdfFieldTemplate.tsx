import React from 'react';
import {View, Text, StyleSheet} from '@react-pdf/renderer';
import {FieldTemplateProps} from 'react-jsonschema-form';

const styles = StyleSheet.create({
  label: {fontSize: 12},
  fields: {lineHeight: 1.5}
});

const PdfFieldTemplate: React.FunctionComponent<FieldTemplateProps> = props => {
  return (
    <>
      {props.label && (
        <View style={styles.label}>
          {props.label === 'gases' ||
          props.label === 'sourceTypeName' ? null : props.classNames.includes(
              'field-object'
            ) ? (
            <Text style={{fontSize: 15, letterSpacing: 2}}>
              {`\n\n${props.label}: `}
            </Text>
          ) : (
            <Text>{`\n${props.label}: `}</Text>
          )}
        </View>
      )}
      {props.children && <Text style={styles.fields}>{props.children}</Text>}
    </>
  );
};

export default PdfFieldTemplate;
