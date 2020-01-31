const Joi = require('@hapi/joi');

// Referenced from official xml-rpc docs: http://xmlrpc.com/spec.md

/**
 * Struct Type Specification
 * http://xmlrpc.com/spec.md#structs
 *
 * A <struct> contains <member>s and each <member> contains a <name> and a <value>.
 *
 */

const StructTypeSchema = Joi.object({
  struct: Joi.array().items(
    Joi.object({
      member: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().required(),
            value: Joi.array().required()
          })
        )
        .required()
    })
  )
});

/**
 * Array Type Specification
 * http://xmlrpc.com/spec.md#arrays
 *
 * An <array> contains a single <data> element, which can contain any number of <value>s.
 */

const ArrayTypeSchema = Joi.object({
  array: Joi.array().items(
    Joi.object({
      data: Joi.array()
        .items(
          Joi.object({
            value: Joi.array().required()
          })
        )
        .required()
    }).required()
  )
});

/**
 * MethodCall Specification
 * http://xmlrpc.com/spec.md#payload-format
 * The <methodCall> must contain a <methodName> sub-item, a string,
 * containing the name of the method to be called.
 * The string may only contain identifier characters, upper and lower-case A-Z,
 * the numeric characters, 0-9, underscore, dot, colon and slash.
 *
 * If the procedure call has parameters, the <methodCall> must contain a <params> sub-item.
 * The <params> sub-item can contain any number of <param>s, each of which has a <value>.
 *
 * */

const MethodCallSchema = Joi.object({
  methodCall: Joi.array()
    .items(
      Joi.object({
        methodName: Joi.string().required()
      }),
      Joi.object({
        params: Joi.array().items(
          Joi.object({
            param: Joi.array()
              .items(
                Joi.object({
                  value: Joi.array()
                    .items(StructTypeSchema, ArrayTypeSchema)
                    .required()
                })
              )
              .required()
          })
        )
      })
    )
    .required()
});

module.exports = MethodCallSchema;
