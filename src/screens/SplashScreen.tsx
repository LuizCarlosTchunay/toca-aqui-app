import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Animated, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../contexts/ThemeContext';
import {RootStackParamList} from '../App';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const {colors, fontSize} = useTheme();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Index after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Index');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
    },
    logo: {
      fontSize: fontSize.xxxl * 2,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    logoAccent: {
      color: colors.accent,
    },
    tagline: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
    loadingContainer: {
      marginTop: 48,
      alignItems: 'center',
    },
    loadingBar: {
      width: 64,
      height: 4,
      backgroundColor: colors.accent,
      borderRadius: 2,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <Text style={styles.logo}>
          Toca<Text style={styles.logoAccent}>Aqui</Text>
        </Text>
        <Text style={styles.tagline}>
          Conectando talentos audiovisuais
        </Text>
      </Animated.View>

      <View style={styles.loadingContainer}>
        <Animated.View
          style={[
            styles.loadingBar,
            {
              opacity: fadeAnim,
            },
          ]}
        />
      </View>
    </View>
  );
};

export default SplashScreen;