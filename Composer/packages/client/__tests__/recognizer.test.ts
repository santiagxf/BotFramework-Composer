// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { LuFile, SDKKinds, QnAFile } from '@bfc/shared';

import {
  getCrossTrainedRecognizerDialog,
  getLuisRecognizerDialogs,
  getMultiLanguagueRecognizerDialog,
  getQnAMakerRecognizerDialogs,
  preserveRecognizer,
} from '../src/recoilModel/Recognizers';

describe('Test the generated recognizer dialogs', () => {
  it('should get MultiLanguagueRecognizer', () => {
    const result = getMultiLanguagueRecognizerDialog(
      'test',
      [
        { id: 'test.en-us', empty: false },
        { id: 'test.fr-fr', empty: false },
      ],
      'qna'
    );

    expect(result.id).toBe('test.qna.dialog');
    expect(result.content.recognizers['en-us']).toBe('test.en-us.qna');
    expect(result.content.recognizers['']).toBe('test.en-us.qna');
    expect(result.content.recognizers['fr-fr']).toBe('test.fr-fr.qna');
  });

  it('should get CrossTrainedRecognizerDialog', () => {
    const result = getCrossTrainedRecognizerDialog(
      'test',
      [{ id: 'test.en-us', empty: false }] as LuFile[],
      [{ id: 'test.en-us', empty: false }] as QnAFile[]
    );
    expect(result.id).toBe('test.lu.qna.dialog');
    expect(result.content.recognizers[0]).toBe('test.lu');
    expect(result.content.recognizers[1]).toBe('test.qna');
  });

  it('should get LuisRecognizerDialogs', () => {
    const result = getLuisRecognizerDialogs('test', [
      { id: 'test.en-us', empty: false },
      { id: 'test.fr-fr', empty: false },
    ] as LuFile[]);
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('test.en-us.lu.dialog');
    expect(result[1].content).toStrictEqual({
      $kind: SDKKinds.LuisRecognizer,
      id: `LUIS_test`,
      applicationId: `=settings.luis.test_fr_fr_lu.appId`,
      version: `=settings.luis.test_fr_fr_lu.version`,
      endpoint: '=settings.luis.endpoint',
      endpointKey: '=settings.luis.endpointKey',
    });
  });

  it('should get QnaMakerRecognizer', () => {
    const result = getQnAMakerRecognizerDialogs('test', [
      { id: 'test.en-us', empty: false },
      { id: 'test.fr-fr', empty: false },
    ] as QnAFile[]);
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('test.en-us.qna.dialog');
    expect(result[1].content).toStrictEqual({
      $kind: SDKKinds.QnAMakerRecognizer,
      id: `QnA_test`,
      knowledgeBaseId: `=settings.qna.test_fr_fr_qna`,
      hostname: '=settings.qna.hostname',
      endpointKey: '=settings.qna.endpointKey',
    });
  });

  it('should preserve Recogniozer', () => {
    const result = preserveRecognizer(
      [{ id: 'test.en-us', content: '' }],
      [
        { id: 'test.en-us', content: 'test' },
        { id: 'test.fr-fr', empty: false },
      ]
    );

    expect(result.length).toBe(1);
    expect(result[0].content).toBe('test');
  });
});
