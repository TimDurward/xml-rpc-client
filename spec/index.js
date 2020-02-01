const Joi = require('@hapi/joi');

// Referenced from official xml-rpc docs: http://xmlrpc.com/spec.md

/**
 * Scalar Types Specifications
 * http://xmlrpc.com/spec.md#a-namescalarsscalar-valuesa
 *
 */

// Four-byte signed integer
const FourByteIntScalarTypeSchema = Joi.object({
  i4: Joi.number()
});

// Integer
const IntScalarTypeSchema = Joi.object({
  int: Joi.number()
});

// Boolean  (0: False / 1: True)
const BooleanScalarTypeSchema = Joi.object({
  boolean: Joi.bool()
});

// String
const StringScalarTypeSchema = Joi.object({
  string: Joi.string()
});

// Double-precision signed floating point number
const DoubleFloatingPointScalarTypeSchema = Joi.object({
  double: Joi.number()
});

// Date/Time (19980717T14:08:55)
const DateTimeISO8601ScalarTypeSchema = Joi.object({
  'dateTime.iso8601': Joi.date()
});

// Base64-encoded binary (eW91IGNhbid0IHJlYWQgdGhpcyE=)
const Base64ScalarTypeSchema = Joi.object({
  base64: Joi.binary()
});

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
            value: Joi.array()
              .items(
                FourByteIntScalarTypeSchema,
                IntScalarTypeSchema,
                BooleanScalarTypeSchema,
                StringScalarTypeSchema,
                DoubleFloatingPointScalarTypeSchema,
                DateTimeISO8601ScalarTypeSchema,
                Base64ScalarTypeSchema
              )
              .required()
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
            value: Joi.array()
              .items(
                FourByteIntScalarTypeSchema,
                IntScalarTypeSchema,
                BooleanScalarTypeSchema,
                StringScalarTypeSchema,
                DoubleFloatingPointScalarTypeSchema,
                DateTimeISO8601ScalarTypeSchema,
                Base64ScalarTypeSchema
              )
              .required()
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

const XMLRPCSchema = Joi.object({
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
                    .items(
                      StructTypeSchema,
                      ArrayTypeSchema,
                      FourByteIntScalarTypeSchema,
                      IntScalarTypeSchema,
                      BooleanScalarTypeSchema,
                      StringScalarTypeSchema,
                      DoubleFloatingPointScalarTypeSchema,
                      DateTimeISO8601ScalarTypeSchema,
                      Base64ScalarTypeSchema
                    )
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

module.exports.XMLRPCSchema = XMLRPCSchema;
